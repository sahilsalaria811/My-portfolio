/**
 * Authentication service using Firebase Authentication
 */

import { STORAGE_KEYS } from '../utils/constants';
import { isFirebaseConfigured, auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

class AuthService {
  constructor() {
    // Set up auth state listener
    if (isFirebaseConfigured && auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.setSession(true);
        } else {
          this.clearSession();
        }
      });
    }
  }

  /**
   * Login with email and password using Firebase Auth
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<boolean>} Success status
   */
  async login(email, password) {
    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error('Firebase is not configured. Please set up Firebase in your .env file.');
      }

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Firebase authentication
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (error) {
      console.error('Login failed:', error);

      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      this.clearSession();
    } catch (error) {
      console.error('Logout failed:', error);
      this.clearSession();
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    if (isFirebaseConfigured && auth) {
      return !!auth.currentUser;
    }

    // Fallback to session storage if Firebase is not configured
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!session) return false;

    try {
      const sessionData = JSON.parse(session);
      return sessionData.authenticated === true;
    } catch (error) {
      console.error('Session validation failed:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user object or null
   */
  getCurrentUser() {
    if (isFirebaseConfigured && auth) {
      return auth.currentUser;
    }
    return null;
  }

  /**
   * Set authentication session
   * @param {boolean} authenticated - Auth status
   */
  setSession(authenticated) {
    const sessionData = {
      authenticated,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(sessionData));
  }

  /**
   * Clear authentication session
   */
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

}

export default new AuthService();