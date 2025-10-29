/**
 * Theme toggle component with sun/moon animation
 * Persists theme preference in localStorage
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { STORAGE_KEYS, THEME } from '../utils/constants';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme ? 
      savedTheme === THEME.DARK : 
      systemDark;
    
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  // Update theme classes and localStorage
  const updateTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add(THEME.DARK);
      localStorage.setItem(STORAGE_KEYS.THEME, THEME.DARK);
    } else {
      document.documentElement.classList.remove(THEME.DARK);
      localStorage.setItem(STORAGE_KEYS.THEME, THEME.LIGHT);
    }
  };

  // Handle theme toggle
  const toggleTheme = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    updateTheme(newDarkState);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-lg glass-card hover:glass-border transition-all duration-200 text-gray-700 dark:text-gray-300"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1 
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-2"
      >
        <Sun className="w-5 h-5 text-yellow-500" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="w-5 h-5"
      >
        <Moon className="w-5 h-5 text-blue-400" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;