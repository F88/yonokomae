import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: '/yonourawa/',
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@yonokomae/catalog': path.resolve(__dirname, '../catalog/dist'),
      '@yonokomae/schema': path.resolve(__dirname, '../schema/dist'),
      '@yonokomae/types': path.resolve(__dirname, '../types/dist'),
      '@yonokomae/data-battle-seeds': path.resolve(
        __dirname,
        '../../data/battle-seeds/dist',
      ),
      '@yonokomae/data-historical-evidence': path.resolve(
        __dirname,
        '../../data/historical-evidence/dist',
      ),
      '@yonokomae/data-news-seeds': path.resolve(
        __dirname,
        '../../data/news-seeds/dist',
      ),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // react: ["react", "react-dom", "react-icons"],
          // radix: ["@radix-ui/react-separator", "@radix-ui/react-slot"],
          // shadcn: ["clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
  },
});
