/**
 * Main App component
 * Sets up routing and global providers
 */

import { BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
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