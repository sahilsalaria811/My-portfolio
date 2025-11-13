/**
 * Create blog page component with rich text editor
 * Protected route for authenticated users only
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Eye,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Tag,
  Search,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';
import AuthGuard from '../components/AuthGuard';
import blogService from '../services/blogService';
import { ROUTES } from '../utils/constants';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    metaTitle: '',
    image: '',
    content: '',
    tags: [],
    seoDescription: '',
    published: true
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear messages
    setMessage({ type: '', text: '' });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    }

    if (!formData.content.trim() || formData.content.trim() === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({
        type: 'error',
        text: 'Please fix the errors below'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await blogService.createBlog({
        title: formData.title.trim(),
        metaTitle: formData.metaTitle.trim() || formData.title.trim(),
        image: formData.image.trim() || null,
        content: formData.content,
        tags: formData.tags,
        seoDescription: formData.seoDescription.trim() || null,
        published: formData.published
      });

      setMessage({
        type: 'success',
        text: 'Blog post published successfully!'
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate(ROUTES.BLOG);
      }, 1500);
    } catch (error) {
      console.error('Error creating blog:', error);
      setMessage({
        type: 'error',
        text: 'Failed to publish blog post. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle cancel
  const handleCancel = () => {
    if (formData.title || formData.content || formData.image) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        navigate(ROUTES.BLOG);
      }
    } else {
      navigate(ROUTES.BLOG);
    }
  };

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
    <AuthGuard>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Create New Blog Post
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Share insights, updates, and knowledge directly from your dashboard.
              </p>
            </motion.div>

            {/* Message Display */}
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* Main Form */}
            <motion.div
              variants={itemVariants}
              className="glass-card p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter an engaging title for your blog post..."
                    className={`w-full px-4 py-3 glass-card border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none ${errors.title ? 'focus:ring-red-500' : 'focus:ring-primary-500'
                      }`}
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                {/* Meta Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Meta Title (SEO) - Optional
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      Custom title for search engines & browser tabs (50-60 characters recommended)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    placeholder={formData.title || "Enter SEO-optimized title (will default to blog title if empty)..."}
                    maxLength={60}
                    className="w-full px-4 py-3 glass-card border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    disabled={isSubmitting}
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.metaTitle.length}/60 characters
                      {formData.metaTitle.length > 0 && formData.metaTitle.length < 50 && (
                        <span className="ml-2 text-yellow-600 dark:text-yellow-400">⚠️ Consider 50-60 chars for best SEO</span>
                      )}
                    </p>
                    {!formData.metaTitle && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Will use: "{formData.title || 'Blog Title'}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Featured Image
                  </label>
                  <ImageUploader
                    value={formData.image}
                    onChange={(value) => handleChange('image', value)}
                    placeholder="Enter image URL (optional)..."
                  />
                </div>

                {/* Tags Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type a tag and press Enter..."
                      className="w-full px-4 py-3 glass-card border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      disabled={isSubmitting}
                    />
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center space-x-1 px-3 py-1 glass-card rounded-full text-sm text-primary-600 dark:text-primary-400"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                              disabled={isSubmitting}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    SEO Description (Optional)
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      Custom meta description for search engines
                    </span>
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                    placeholder="Write a brief SEO-friendly description (150-160 characters recommended)..."
                    rows={3}
                    maxLength={160}
                    className="w-full px-4 py-3 glass-card border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>

                {/* Published/Draft Toggle */}
                <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                  <div className="flex items-center space-x-3">
                    {formData.published ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formData.published ? 'Published' : 'Draft'}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.published ? 'Will be visible to all visitors' : 'Save as draft for later'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('published', !formData.published)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${formData.published
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
                      : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20'
                      }`}
                    disabled={isSubmitting}
                  >
                    {formData.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>

                {/* Content Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleChange('content', value)}
                    placeholder="Write your blog content here..."
                  />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.content}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-purple transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Publish Post</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 sm:flex-none px-6 py-3 glass-card hover:glass-border transition-all duration-200 text-gray-700 dark:text-gray-300 flex items-center justify-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <Eye className="w-5 h-5" />
                    <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 sm:flex-none px-6 py-3 glass-card hover:glass-border transition-all duration-200 text-red-600 dark:text-red-400 flex items-center justify-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Preview Section */}
            {showPreview && formData.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="glass-card p-8">
                  <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </div>

                  {/* Preview Content */}
                  <div className="space-y-6">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {formData.title}
                    </h2>

                    {formData.content && (
                      <div
                        className="prose prose-lg max-w-none prose-gray dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: formData.content
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateBlog;