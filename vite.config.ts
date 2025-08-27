import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: '/yonourawa/',
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
