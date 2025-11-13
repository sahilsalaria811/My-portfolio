/**
 * Blog list page component
 * Features search functionality, grid layout, and empty states
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, PlusCircle, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import blogService from '../services/blogService';
import authService from '../services/authService';
import { ROUTES } from '../utils/constants';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load blogs on component mount
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        // Load blogs (including drafts if authenticated)
        const blogData = await blogService.getAllBlogs(isAuth);
        setBlogs(blogData);
        setFilteredBlogs(blogData);

        // Load available tags
        const tags = await blogService.getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = blogs;

    // Filter by tag if selected
    if (selectedTag) {
      filtered = filtered.filter(blog =>
        blog.tags && blog.tags.some(tag =>
          tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(lowercaseQuery) ||
        blog.excerpt?.toLowerCase().includes(lowercaseQuery) ||
        blog.seoDescription?.toLowerCase().includes(lowercaseQuery) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, selectedTag, blogs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card text-sm text-gray-600 dark:text-gray-400">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span>Insights & Knowledge</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold gradient-text mb-6"
          >
            My Blog
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Thoughts on QA, Automation, and the Future of AI Testing
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog posts..."
                className="w-full pl-10 pr-4 py-3 glass-card border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            {/* Tag Filter */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 self-center">Filter by:</span>
                {availableTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${selectedTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'glass-card text-gray-700 dark:text-gray-300 hover:glass-border'
                      }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                    {selectedTag === tag && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Create Blog Button (Admin Only) */}
          {isAuthenticated && (
            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <Link to={ROUTES.CREATE_BLOG}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-purple transition-all duration-200"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create New Post</span>
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <>
            {filteredBlogs.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredBlogs.map((blog, index) => (
                  <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="glass-card p-12 inline-block">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {searchQuery ? 'No posts found' : 'No posts yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    {searchQuery
                      ? `No blog posts match your search for "${searchQuery}".`
                      : "I'm currently crafting new insights. Stay tuned!"
                    }
                  </p>
                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Clear Search
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Search Results Info */}
        {!loading && searchQuery && filteredBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Found {filteredBlogs.length} post{filteredBlogs.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogList;