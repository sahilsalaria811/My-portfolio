/**
 * Blog card component for displaying blog posts in grid
 * Features glassmorphism design and hover animations
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag, FileText, Eye } from 'lucide-react';
import { formatBlogDate } from '../utils/formatDate';
import { ROUTES } from '../utils/constants';

const BlogCard = ({ blog, index = 0 }) => {
  const viewCount = Number.isFinite(blog?.views)
    ? blog.views
    : Number(blog?.views) || 0;

  const detailPath = blog?.slug ? `${ROUTES.BLOG}/${blog.slug}` : `${ROUTES.BLOG}/${blog.id}`;

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const overlayVariants = {
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group"
    >
      <Link to={detailPath}>
        <div className="glass-card overflow-hidden h-full hover:glass-border transition-all duration-300">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500/20 via-accent-cyan/20 to-accent-purple/20">
            {blog.image ? (
              <motion.img
                variants={imageVariants}
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.parentElement?.querySelector('.image-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center image-fallback ${blog.image ? 'hidden' : ''}`}>
              <div className="text-center p-4">
                <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No image</p>
              </div>
            </div>

            {/* Gradient overlay */}
            <motion.div
              variants={overlayVariants}
              initial={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0"
            />

            {/* Date badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="glass px-3 py-1 rounded-full text-xs text-white font-medium">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatBlogDate(blog.date)}</span>
                </div>
              </div>
              <div className="glass px-3 py-1 rounded-full text-xs text-white/90 font-medium">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{viewCount.toLocaleString()} view{viewCount === 1 ? '' : 's'}</span>
                </div>
              </div>
              {blog.published === false && (
                <div className="glass px-3 py-1 rounded-full text-xs text-yellow-300 font-medium bg-yellow-500/20">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Draft</span>
                  </div>
                </div>
              )}
            </div>

            {/* Read more arrow */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute bottom-4 right-4 p-2 rounded-full glass"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <motion.h3
              className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-300"
              whileHover={{ x: 5 }}
            >
              {blog.title}
            </motion.h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
              {blog.excerpt}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded text-xs font-medium"
                  >
                    <Tag className="w-2.5 h-2.5 inline mr-1" />
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                    +{blog.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Read more link */}
            <motion.div
              className="mt-4 flex items-center space-x-2 text-primary-600 dark:text-primary-400 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;