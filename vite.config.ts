import path from 'path'
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Substitutes <!--SITE_URL--> tokens in index.html at build time so OG/Twitter
// meta tags can use absolute URLs when VITE_SITE_URL is configured. When unset,
// tokens collapse to '', leaving root-relative URLs (/og-image.png) which
// social crawlers resolve against the page's own origin.
const siteUrlPlugin = (): PluginOption => {
  const siteUrl = process.env.VITE_SITE_URL ?? ''
  const token = '<!--SITE_URL-->'
  return {
    name: 'substitute-site-url',
    transformIndexHtml(html) {
      return html.split(token).join(siteUrl)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
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
