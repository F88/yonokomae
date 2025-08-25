import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-icons"],
          radix: ["@radix-ui/react-separator", "@radix-ui/react-slot"],
          shadcn: ["clsx", "tailwind-merge", "class-variance-authority"],
          faker: ["@faker-js/faker"],
        },
      },
    },
  },
})
