/**
 * Blog service for handling CRUD operations
 * Supports both localStorage and Firebase Firestore
 */

import { nanoid } from 'nanoid';
import { STORAGE_KEYS, PLACEHOLDER_BLOGS } from '../utils/constants';
import { isFirebaseConfigured, db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  query
} from 'firebase/firestore';

class BlogService {
  constructor() {
    this.collectionName = 'blogs';
    this.initializePlaceholderBlogs();
  }

  /**
   * Initialize placeholder blogs if none exist
   */
  initializePlaceholderBlogs() {
    if (!isFirebaseConfigured) {
      const existingBlogs = this.getStoredBlogs();
      if (existingBlogs.length === 0) {
        localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(PLACEHOLDER_BLOGS));
      }
    }
  }

  /**
   * Get stored blogs from localStorage
   * @returns {Array} Array of blogs
   */
  getStoredBlogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BLOGS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored blogs:', error);
      return [];
    }
  }

  /**
   * Save blogs to localStorage
   * @param {Array} blogs - Blogs to save
   */
  saveStoredBlogs(blogs) {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
    } catch (error) {
      console.error('Error saving blogs to localStorage:', error);
    }
  }

  /**
   * Get all blogs
   * @returns {Promise<Array>} Array of blogs
   */
  async getAllBlogs() {
    try {
      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        const q = query(collection(db, this.collectionName), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  /**
   * Get blog by ID
   * @param {string} id - Blog ID
   * @returns {Promise<Object|null>} Blog object or null
   */
  async getBlogById(id) {
    try {
      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          };
        }
        return null;
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        return blogs.find(blog => blog.id === id) || null;
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }

  /**
   * Create new blog
   * @param {Object} blogData - Blog data
   * @returns {Promise<Object>} Created blog
   */
  async createBlog(blogData) {
    try {
      const newBlog = {
        id: nanoid(),
        ...blogData,
        date: new Date().toISOString(),
        excerpt: this.generateExcerpt(blogData.content)
      };

      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        const docRef = await addDoc(collection(db, this.collectionName), {
          ...newBlog,
          id: undefined // Remove id as Firestore will generate one
        });
        return {
          ...newBlog,
          id: docRef.id
        };
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        blogs.unshift(newBlog);
        this.saveStoredBlogs(blogs);
        return newBlog;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  /**
   * Update blog
   * @param {string} id - Blog ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated blog
   */
  async updateBlog(id, updateData) {
    try {
      const updatedData = {
        ...updateData,
        excerpt: updateData.content ? this.generateExcerpt(updateData.content) : undefined
      };

      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        const docRef = doc(db, this.collectionName, id);
        await updateDoc(docRef, updatedData);
        const updatedDoc = await getDoc(docRef);
        return {
          id: updatedDoc.id,
          ...updatedDoc.data()
        };
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        const index = blogs.findIndex(blog => blog.id === id);
        
        if (index !== -1) {
          blogs[index] = { ...blogs[index], ...updatedData };
          this.saveStoredBlogs(blogs);
          return blogs[index];
        }
        throw new Error('Blog not found');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  /**
   * Delete blog
   * @param {string} id - Blog ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteBlog(id) {
    try {
      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        await deleteDoc(doc(db, this.collectionName, id));
        return true;
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        const filteredBlogs = blogs.filter(blog => blog.id !== id);
        this.saveStoredBlogs(filteredBlogs);
        return true;
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      return false;
    }
  }

  /**
   * Generate excerpt from content
   * @param {string} content - HTML content
   * @returns {string} Plain text excerpt
   */
  generateExcerpt(content) {
    if (!content) return '';
    
    // Remove HTML tags and get first 150 characters
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  }

  /**
   * Search blogs by title
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered blogs
   */
  async searchBlogs(query) {
    try {
      const allBlogs = await this.getAllBlogs();
      if (!query.trim()) return allBlogs;

      const lowercaseQuery = query.toLowerCase();
      return allBlogs.filter(blog => 
        blog.title.toLowerCase().includes(lowercaseQuery) ||
        blog.excerpt.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  }
}

export default new BlogService();