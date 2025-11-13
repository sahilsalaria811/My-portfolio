// @ts-nocheck
/**
 * Application routing configuration
 * Defines all routes and lazy loading for performance
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
// Lazy load components for better performance
const Home = lazy(() => import('../pages/Home'));
const BlogList = lazy(() => import('../pages/BlogList'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));
const CreateBlog = lazy(() => import('../pages/CreateBlog'));
const Login = lazy(() => import('../pages/Login'));

// Loading component for suspense fallback
const LoadingSpinner = () => (
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
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </motion.div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="create-blog" element={<CreateBlog />} />
        </Route>

        {/* Routes without Layout (Login) */}
        <Route path="/login" element={<Login />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;