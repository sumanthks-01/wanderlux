import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Security headers for `vite preview` (mirrors prod server config)
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(self), camera=(), microphone=()',
    },
  },

  build: {
    // Warn if any chunk exceeds 700kb
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        // Rolldown-compatible manualChunks (must be a function, not an object)
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) return 'react-vendor'

          if (id.includes('node_modules/framer-motion')) return 'framer'
          if (id.includes('node_modules/lucide-react'))  return 'lucide'
          if (id.includes('node_modules/@google/genai')) return 'genai'
        },
      },
    },
  },
})
