/**
 * Blog card component for displaying blog posts in grid
 * Features glassmorphism design and hover animations
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatBlogDate } from '../utils/formatDate';
import { ROUTES } from '../utils/constants';

const BlogCard = ({ blog, index = 0 }) => {
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
      <Link to={`${ROUTES.BLOG}/${blog.id}`}>
        <div className="glass-card overflow-hidden h-full hover:glass-border transition-all duration-300">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              variants={imageVariants}
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <motion.div
              variants={overlayVariants}
              initial={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0"
            />
            
            {/* Date badge */}
            <div className="absolute top-4 left-4">
              <div className="glass px-3 py-1 rounded-full text-xs text-white font-medium">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatBlogDate(blog.date)}</span>
                </div>
              </div>
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