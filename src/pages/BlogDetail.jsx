/**
 * Blog detail page component
 * Features rich content display, social sharing, and navigation
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Share2,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  AlertCircle,
  Tag,
  Eye,
  User,
  Clock
} from 'lucide-react';
import DOMPurify from 'dompurify';
import blogService from '../services/blogService';
import { formatBlogDate } from '../utils/formatDate';
import { ROUTES, SITE_CONFIG } from '../utils/constants';
import { showToast } from '../components/Toast';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroImageReady, setHeroImageReady] = useState(false);

  const viewSessionKey = useMemo(() => (slug ? `blog_viewed_${slug}` : null), [slug]);

  // Load blog data
  useEffect(() => {
    const loadBlog = async () => {
      try {
        if (!slug) {
          setError('Blog identifier is required');
          return;
        }

        let hasViewedThisSession = false;
        if (viewSessionKey) {
          try {
            hasViewedThisSession = sessionStorage.getItem(viewSessionKey) === 'true';
          } catch (storageError) {
            console.warn('Session storage unavailable, view tracking may be duplicated:', storageError);
          }
        }
        const shouldIncrement = !hasViewedThisSession;
        const blogData = await blogService.getBlogById(slug, shouldIncrement);
        if (!blogData) {
          setError('Blog post not found');
          return;
        }

        setBlog(blogData);
        setHeroImageReady(false);
        if (shouldIncrement && viewSessionKey) {
          try {
            sessionStorage.setItem(viewSessionKey, 'true');
          } catch (storageError) {
            console.warn('Failed to persist view tracking state:', storageError);
          }
        }

        // Update page title for SEO
        const pageTitle = blogData.metaTitle || blogData.title || 'Blog Post';
        document.title = `${pageTitle} | Sahil Salaria`;

        // Update meta description if available
        if (blogData.seoDescription) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', blogData.seoDescription);
          }
        }
      } catch (err) {
        console.error('Error loading blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();

    // Reset title on unmount
    return () => {
      document.title = 'Sahil Salaria — Quality Analyst & Automation Expert';
    };
  }, [slug, viewSessionKey]);

  // Share functionality
  const shareUrl = window.location.href;
  const shareTitle = blog ? `${blog.title} by Sahil Salaria` : '';

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const urls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      copy: () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Failed to copy link', 'error');
        });
      }
    };

    if (platform === 'copy') {
      urls.copy();
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading blog post...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error === 'Blog post not found' ? 'Post Not Found' : 'Error'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The blog post you\'re looking for doesn\'t exist.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-2 glass-card hover:glass-border transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              Go Back
            </motion.button>
            <Link to={ROUTES.BLOG}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                View All Posts
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  const showHeroImage = Boolean(blog?.image && heroImageReady);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className={`relative py-20 px-4 sm:px-6 lg:px-8 ${!showHeroImage ? 'bg-gradient-to-br from-primary-50 via-accent-cyan/10 to-accent-purple/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' : ''}`}>
        {blog.image && (
          <div className="absolute inset-0 z-0">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              style={{ display: showHeroImage ? 'block' : 'none' }}
              onLoad={() => setHeroImageReady(true)}
              onError={() => setHeroImageReady(false)}
            />
            {showHeroImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            )}
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              to={ROUTES.BLOG}
              className={`inline-flex items-center space-x-2 glass-card px-4 py-2 hover:glass-border transition-all duration-200 ${showHeroImage
                ? 'text-white'
                : 'text-gray-900 dark:text-gray-100'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </motion.div>

          {/* Title and Meta */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${showHeroImage
              ? 'text-white'
              : 'text-gray-900 dark:text-white'
              }`}>
              {blog.title}
            </h1>

            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm ${showHeroImage
              ? 'text-white/80'
              : 'text-gray-700 dark:text-gray-300'
              }`}>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatBlogDate(blog.date)}</span>
              </div>
              {blog.lastUpdated && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatBlogDate(blog.lastUpdated)}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{blog.authorName || 'Sahil Salaria'}</span>
              </div>
              {blog.views !== undefined && (
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views} view{blog.views !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-2 mt-4"
              >
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 glass rounded-full text-xs font-medium ${showHeroImage
                      ? 'text-white/90'
                      : 'text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-800/50'
                      }`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="glass-card p-8 md:p-12"
          >
            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none prose-gray dark:prose-invert prose-headings:gradient-text prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-blockquote:border-primary-500 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded text-gray-700 dark:text-gray-200"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content)
              }}
            />

            {/* Share Section */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Share this post
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Help others discover this content
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare('linkedin')}
                    className="p-3 rounded-xl glass-card hover:glass-border transition-all duration-200 text-blue-600 hover:text-blue-700"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare('twitter')}
                    className="p-3 rounded-xl glass-card hover:glass-border transition-all duration-200 text-sky-500 hover:text-sky-600"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare('copy')}
                    className="p-3 rounded-xl glass-card hover:glass-border transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Copy link"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Author Section */}
            <motion.div
              variants={itemVariants}
              className="mt-8 p-6 glass rounded-xl"
            >
              <p className="text-center text-gray-600 dark:text-gray-400 italic">
                Published by <span className="font-semibold gradient-text">{blog.authorName || 'Sahil Salaria'}</span> —
                Dedicated to innovation in Quality & Automation.
                {blog.views !== undefined && (
                  <span className="block mt-2 text-sm">
                    {blog.views} view{blog.views !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link to={ROUTES.BLOG}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-purple transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>View All Posts</span>
            </motion.button>
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default BlogDetail;