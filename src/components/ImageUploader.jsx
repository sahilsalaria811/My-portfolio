/**
 * Image uploader component with preview and URL input
 * Features drag-and-drop functionality and validation
 */

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { isFirebaseConfigured, storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { showToast } from './Toast';

const ImageUploader = ({ value, onChange, placeholder = "Paste image URL (e.g., from Imgur, Cloudinary, etc.)..." }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState(value || '');
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

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

  // Handle file upload to Firebase Storage
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (jpg, png, gif, webp, etc.)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    if (!isFirebaseConfigured || !storage) {
      showToast('Direct upload unavailable. Please use an image URL from Imgur, Cloudinary, or Unsplash', 'error', 5000);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setPreviewError(false);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `blog-images/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          showToast('Failed to upload image. Please try again or use an image URL.', 'error');
          setUploading(false);
          setUploadProgress(0);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(downloadURL);
            onChange(downloadURL);
            setUploading(false);
            setUploadProgress(0);
          } catch (error) {
            console.error('Error getting download URL:', error);
            showToast('Image uploaded but failed to get URL. Please try again.', 'error');
            setUploading(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image. Please try again.', 'error');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Handle click to open file dialog
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Drag and Drop Area - Available if Firebase Storage is configured */}
      {isFirebaseConfigured && storage ? (
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`glass-card border-2 border-dashed transition-all duration-200 cursor-pointer ${dragActive || uploading
            ? 'border-primary-400 bg-primary-50/20 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
            } ${uploading ? 'pointer-events-none' : ''}`}
        >
          <div className="p-8 text-center">
            {uploading ? (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-primary-500 mb-4 animate-spin" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Uploading image...
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(uploadProgress)}% complete
                </p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">Drag and drop an image here, or click to browse</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports JPG, PNG, GIF, WebP (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="glass-card border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Direct upload (coming soon)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For now, please use image URLs from Imgur, Cloudinary, Unsplash, or other image hosting services
          </p>
        </div>
      )}

      {/* Helpful URLs Note */}
      <div className="glass-card p-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="font-medium mb-2">💡 Popular free image hosting services:</p>
        <ul className="space-y-1 list-disc list-inside text-gray-400 dark:text-gray-500">
          <li><a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Imgur</a> - Free, no account needed</li>
          <li><a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Cloudinary</a> - Free tier available</li>
          <li><a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Unsplash</a> - Free stock photos</li>
          <li><a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Pexels</a> - Free stock photos</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;