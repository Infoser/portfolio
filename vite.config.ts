import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router') || id.includes('/react-helmet-async')) return 'react-vendor';
          if (id.includes('/react-markdown/') || id.includes('/remark-gfm/') || id.includes('/rehype-highlight/') || id.includes('/highlight.js/')) return 'markdown';
          if (id.includes('/framer-motion/')) return 'motion';
          if (id.includes('/radix-ui/')) return 'radix';
        },
      },
    },
  },
})
