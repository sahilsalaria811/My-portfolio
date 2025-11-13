/**
 * Blog service for handling CRUD operations
 * Supports both localStorage and Firebase Firestore
 */

import { nanoid } from 'nanoid';
import { STORAGE_KEYS, PLACEHOLDER_BLOGS } from '../utils/constants';
import { isFirebaseConfigured, db } from './firebase';
import { slugify } from '../utils/slugify';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  where,
  serverTimestamp,
  increment,
  limit
} from 'firebase/firestore';
import authService from './authService';

class BlogService {
  constructor() {
    this.collectionName = 'blogs';
    this.initializePlaceholderBlogs();
  }

  generateBaseSlug(title, fallbackId = null) {
    const base = slugify(title || '');
    if (base) return base;
    if (fallbackId) return `post-${fallbackId}`;
    return `post-${nanoid(6)}`;
  }

  async isSlugAvailable(slug, excludeId = null, existingBlogs = null) {
    if (!slug) return false;

    if (isFirebaseConfigured && db) {
      try {
        const slugQuery = query(
          collection(db, this.collectionName),
          where('slug', '==', slug),
          limit(1)
        );
        const snapshot = await getDocs(slugQuery);

        if (snapshot.empty) {
          return true;
        }

        const match = snapshot.docs[0];
        return excludeId ? match.id === excludeId : false;
      } catch (error) {
        console.warn('Slug availability check failed:', error);
        return false;
      }
    }

    const blogs = existingBlogs || this.getStoredBlogs();
    const conflict = blogs.find(blog => blog.slug === slug);
    return !conflict || conflict.id === excludeId;
  }

  async generateUniqueSlug(title, excludeId = null, existingBlogs = null) {
    const baseSlug = this.generateBaseSlug(title, excludeId);
    let candidate = baseSlug;
    let suffix = 1;

    while (!(await this.isSlugAvailable(candidate, excludeId, existingBlogs))) {
      candidate = `${baseSlug}-${suffix++}`;
    }

    return candidate;
  }

  async ensureFirestoreSlug(docId, data) {
    if (!isFirebaseConfigured || !db || !docId || !data) return data?.slug;
    if (data.slug) return data.slug;

    try {
      const slug = await this.generateUniqueSlug(data.title || `post-${docId}`, docId);
      await updateDoc(doc(db, this.collectionName, docId), { slug });
      data.slug = slug;
      return slug;
    } catch (error) {
      console.warn('Failed to backfill slug for document:', docId, error);
      return data.slug;
    }
  }

  ensureLocalSlugs(blogs) {
    if (!Array.isArray(blogs)) return blogs;

    const used = new Map();
    let modified = false;

    blogs.forEach(blog => {
      if (blog.slug) {
        used.set(blog.slug, blog.id);
      }
    });

    blogs.forEach(blog => {
      if (!blog.slug) {
        const base = this.generateBaseSlug(blog.title || blog.id, blog.id);
        let candidate = base;
        let counter = 1;

        while (used.has(candidate) && used.get(candidate) !== blog.id) {
          candidate = `${base}-${counter++}`;
        }

        blog.slug = candidate;
        used.set(candidate, blog.id);
        modified = true;
      }
    });

    if (modified) {
      this.saveStoredBlogs(blogs);
    }

    return blogs;
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
      const blogs = stored ? JSON.parse(stored) : [];
      return this.ensureLocalSlugs(blogs);
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
   * Get all blogs (only published by default)
   * @param {boolean} includeDrafts - Include draft posts (admin only)
   * @returns {Promise<Array>} Array of blogs
   */
  async getAllBlogs(includeDrafts = false) {
    try {
      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        let q;
        if (includeDrafts && authService.isAuthenticated()) {
          // Authenticated users can see all posts (including drafts)
          q = query(collection(db, this.collectionName), orderBy('date', 'desc'));
        } else {
          // Public users only see published posts
          // Try composite query first, fallback to simple query if index missing
          q = query(
            collection(db, this.collectionName),
            where('published', '==', true),
            orderBy('date', 'desc')
          );
        }

        let querySnapshot;
        let needsClientSideFilter = false;

        try {
          querySnapshot = await getDocs(q);
        } catch (indexError) {
          // If composite index is missing, use simple query and filter client-side
          if (indexError.code === 'failed-precondition' || indexError.message?.includes('index')) {
            console.warn('Firestore index missing. Using fallback query. To fix, create an index in Firebase Console:', indexError);
            needsClientSideFilter = true;
            // Fallback: simple query without where clause
            q = query(collection(db, this.collectionName), orderBy('date', 'desc'));
            querySnapshot = await getDocs(q);
          } else {
            throw indexError;
          }
        }

        const blogs = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          if (!data.slug) {
            await this.ensureFirestoreSlug(docSnap.id, data);
          }
          blogs.push({
            id: docSnap.id,
            ...this.convertTimestamps(data),
            slug: data.slug
          });
        }

        // If index is missing, filter published posts client-side
        if (needsClientSideFilter || (!includeDrafts && !authService.isAuthenticated())) {
          blogs = blogs.filter(blog =>
            blog.published === true || (blog.published === undefined && !needsClientSideFilter)
          );
        }

        return blogs;
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        const filtered = includeDrafts ? blogs : blogs.filter(blog => blog.published !== false);
        return filtered.sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
        });
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  /**
   * Get blog by ID
   * @param {string} id - Blog ID
   * @param {boolean} incrementViews - Increment view count
   * @returns {Promise<Object|null>} Blog object or null
   */
  async getBlogById(identifier, incrementViews = true) {
    try {
      if (isFirebaseConfigured && db) {
        if (!identifier) return null;

        const collectionRef = collection(db, this.collectionName);
        let docRef = null;
        let docSnap = null;

        try {
          const slugQuery = query(
            collectionRef,
            where('slug', '==', identifier),
            limit(1)
          );
          const slugSnapshot = await getDocs(slugQuery);
          if (!slugSnapshot.empty) {
            docSnap = slugSnapshot.docs[0];
            docRef = doc(db, this.collectionName, docSnap.id);
          }
        } catch (slugError) {
          console.warn('Failed to fetch blog by slug:', slugError);
        }

        if (!docSnap) {
          docRef = doc(db, this.collectionName, identifier);
          docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return null;
          }
        }

        const data = docSnap.data();
        if (!data.slug) {
          await this.ensureFirestoreSlug(docSnap.id, data);
        }

        if (incrementViews && data.published !== false) {
          try {
            await updateDoc(docRef, {
              views: increment(1)
            });
            data.views = (data.views || 0) + 1;
          } catch (viewError) {
            console.warn('Failed to increment views:', viewError);
          }
        }

        return {
          id: docSnap.id,
          ...this.convertTimestamps(data),
          slug: data.slug
        };
      } else {
        const blogs = this.getStoredBlogs();
        let blog =
          blogs.find(blog => blog.slug === identifier) ||
          blogs.find(blog => blog.id === identifier) ||
          null;

        if (blog && incrementViews && blog.published !== false) {
          blog.views = (blog.views || 0) + 1;
          this.saveStoredBlogs(blogs);
        }

        return blog;
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
      const currentUser = authService.getCurrentUser();
      const authorName = blogData.authorName || 'Sahil Salaria';
      const authorId = currentUser?.uid || null;

      const slug = await this.generateUniqueSlug(blogData.title, null);

      const blogPayload = {
        title: blogData.title.trim(),
        metaTitle: blogData.metaTitle?.trim() || blogData.title.trim(),
        slug,
        content: blogData.content,
        image: blogData.image?.trim() || null,
        excerpt: blogData.seoDescription?.trim() || this.generateExcerpt(blogData.content),
        seoDescription: blogData.seoDescription?.trim() || null,
        tags: Array.isArray(blogData.tags) ? blogData.tags.filter(tag => tag.trim()) : [],
        published: blogData.published !== undefined ? blogData.published : true,
        authorName,
        authorId,
        views: 0,
        ...(isFirebaseConfigured && db ? {
          date: serverTimestamp(),
          lastUpdated: serverTimestamp()
        } : {
          date: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        })
      };

      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        const docRef = await addDoc(collection(db, this.collectionName), blogPayload);
        const createdDoc = await getDoc(docRef);
        return {
          id: docRef.id,
          ...this.convertTimestamps(createdDoc.data())
        };
      } else {
        // localStorage
        const newBlog = {
          id: nanoid(),
          ...blogPayload
        };
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
        excerpt: updateData.content ?
          (updateData.seoDescription?.trim() || this.generateExcerpt(updateData.content)) :
          undefined,
        tags: updateData.tags ?
          (Array.isArray(updateData.tags) ? updateData.tags.filter(tag => tag.trim()) : []) :
          undefined,
        lastUpdated: isFirebaseConfigured && db ? serverTimestamp() : new Date().toISOString()
      };

      if (updateData.slug) {
        updatedData.slug = await this.generateUniqueSlug(updateData.slug, id);
      }

      // Remove undefined values
      Object.keys(updatedData).forEach(key =>
        updatedData[key] === undefined && delete updatedData[key]
      );

      if (isFirebaseConfigured && db) {
        // Firebase Firestore
        const docRef = doc(db, this.collectionName, id);
        await updateDoc(docRef, updatedData);
        const updatedDoc = await getDoc(docRef);
        return {
          id: updatedDoc.id,
          ...this.convertTimestamps(updatedDoc.data())
        };
      } else {
        // localStorage
        const blogs = this.getStoredBlogs();
        const index = blogs.findIndex(blog => blog.id === id);

        if (index !== -1) {
          blogs[index] = {
            ...blogs[index],
            ...updatedData,
            lastUpdated: new Date().toISOString()
          };
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
   * Search blogs by title, excerpt, or tags
   * @param {string} searchQuery - Search query
   * @param {string} tagFilter - Optional tag to filter by
   * @returns {Promise<Array>} Filtered blogs
   */
  async searchBlogs(searchQuery, tagFilter = null) {
    try {
      const allBlogs = await this.getAllBlogs();
      let filtered = allBlogs;

      // Filter by tag if provided
      if (tagFilter) {
        filtered = filtered.filter(blog =>
          blog.tags && blog.tags.some(tag =>
            tag.toLowerCase() === tagFilter.toLowerCase()
          )
        );
      }

      // Search in title, excerpt, content, and tags
      if (searchQuery && searchQuery.trim()) {
        const lowercaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(blog =>
          blog.title.toLowerCase().includes(lowercaseQuery) ||
          blog.excerpt?.toLowerCase().includes(lowercaseQuery) ||
          blog.seoDescription?.toLowerCase().includes(lowercaseQuery) ||
          (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
        );
      }

      return filtered;
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  }

  /**
   * Get all unique tags from published blogs
   * @returns {Promise<Array>} Array of unique tags
   */
  async getAllTags() {
    try {
      const blogs = await this.getAllBlogs();
      const tagSet = new Set();

      blogs.forEach(blog => {
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach(tag => tagSet.add(tag));
        }
      });

      return Array.from(tagSet).sort();
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  /**
   * Convert Firestore timestamps to JavaScript dates
   * @param {Object} data - Document data
   * @returns {Object} Data with converted timestamps
   */
  convertTimestamps(data) {
    if (!data) return data;

    const converted = { ...data };

    // Convert Firestore timestamps to Date objects or ISO strings
    if (data.date && data.date.toDate) {
      converted.date = data.date.toDate();
    } else if (data.date && typeof data.date === 'object' && data.date.seconds) {
      converted.date = new Date(data.date.seconds * 1000);
    }

    if (data.lastUpdated && data.lastUpdated.toDate) {
      converted.lastUpdated = data.lastUpdated.toDate();
    } else if (data.lastUpdated && typeof data.lastUpdated === 'object' && data.lastUpdated.seconds) {
      converted.lastUpdated = new Date(data.lastUpdated.seconds * 1000);
    }

    return converted;
  }
}

export default new BlogService();