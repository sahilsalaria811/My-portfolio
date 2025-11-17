import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path - set VITE_GITHUB_PAGES=true when building for GitHub Pages
  base: process.env.VITE_GITHUB_PAGES === 'true' ? '/My-portfolio/' : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
