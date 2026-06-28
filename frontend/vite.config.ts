import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Make matches agnostic to package managers (npm vs Yarn PnP) and OS paths
          if (/[\\/](react|react-dom|react-router-dom)[\\/]/.test(id) || id.includes('.yarn') && id.includes('react')) {
            return 'react-vendor';
          }
          if (/[\\/]firebase[\\/]/.test(id) || id.includes('.yarn') && id.includes('firebase')) {
            return 'firebase-vendor';
          }
          if (/[\\/]framer-motion[\\/]/.test(id) || id.includes('.yarn') && id.includes('framer-motion')) {
            return 'framer-motion-vendor';
          }
          if (/[\\/](leaflet|react-leaflet)[\\/]/.test(id) || id.includes('.yarn') && id.includes('leaflet')) {
            return 'leaflet-vendor';
          }
          if (/[\\/](lucide-react|sonner|clsx|tailwind-merge)[\\/]/.test(id) || id.includes('.yarn') && (id.includes('lucide-react') || id.includes('sonner'))) {
            return 'ui-vendor';
          }
        },
      },
    },
  },
})
