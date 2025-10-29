/**
 * Image uploader component with preview and URL input
 * Features drag-and-drop functionality and validation
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';

const ImageUploader = ({ value, onChange, placeholder = "Enter image URL..." }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState(value || '');
  const [previewError, setPreviewError] = useState(false);

  // Handle URL input change
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewError(false);
    onChange(url);
  };

  // Handle image preview error
  const handleImageError = () => {
    setPreviewError(true);
  };

  // Clear image
  const clearImage = () => {
    setImageUrl('');
    setPreviewError(false);
    onChange('');
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // For now, we'll just show a message that file upload isn't supported
      // In a real app, you'd upload to a service like Cloudinary or Firebase Storage
      alert('File upload not implemented yet. Please use an image URL instead.');
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LinkIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 glass-card border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        {imageUrl && (
          <button
            type="button"
            onClick={clearImage}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Image Preview */}
      {imageUrl && !previewError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="glass-card p-4">
            <img
              src={imageUrl}
              alt="Preview"
              onError={handleImageError}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Image Preview
            </p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {previewError && imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 border-red-200 dark:border-red-800"
        >
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <ImageIcon className="h-5 w-5" />
            <span className="text-sm">Unable to load image from this URL</span>
          </div>
        </motion.div>
      )}

      {/* Drag and Drop Area */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`glass-card border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? 'border-primary-400 bg-primary-50/20 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Drag and drop an image here, or enter a URL above</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              (File upload will be implemented in future version)
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageUploader;