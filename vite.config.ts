import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@features': '/src/features',
      '@hooks': '/src/hooks',
      '@store': '/src/store',
      '@utils': '/src/utils',
      '@styles': '/src/styles',
      '@assets': '/src/assets'
    }
  },
  optimizeDeps: {
    include: [
      '@mui/icons-material/TrendingUp',
      '@mui/icons-material/TrendingDown',
      '@mui/icons-material/SignalCellularAlt',
      '@mui/icons-material/SignalCellularAlt2Bar',
      '@mui/icons-material/SignalCellularAlt1Bar',
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  publicDir: 'public',
})
