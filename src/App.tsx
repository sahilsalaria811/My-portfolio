/**
 * Main App component
 * Sets up routing and global providers
 */

import { BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';

// Get base path from environment or default to root
const BASE_PATH = import.meta.env.VITE_BASE_PATH || '/';

function App() {
  return (
    <Router basename={BASE_PATH}>
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