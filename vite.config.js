import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:process.env.VITE_BASE_PATH || "/eduHeaven" ,
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Configure Three.js to work well with Vite
  optimizeDeps: {
    include: ['three'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});