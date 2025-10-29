/**
 * Main layout component wrapping all pages
 * Provides consistent structure with Navbar and Footer
 */

import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-bg animate-gradient-xy opacity-10 pointer-events-none" />

      {/* Main layout */}
      <div className="relative z-10">
        <Navbar />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-140px)]"
        >
          <Outlet />
        </motion.main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;