/**
 * Main App component
 * Sets up routing and global providers
 */

import { BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';

// GitHub Pages base path - matches vite.config.ts base path
const basename = import.meta.env.VITE_GITHUB_PAGES === 'true' ? '/My-portfolio' : '';

function App() {
  return (
    <Router basename={basename}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="App"
      >
        <AppRoutes />
      </motion.div>
    </Router>
  );
}

export default App;