import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  
  server: {
    proxy: {
      '/api': process.env.VITE_BACKEND_URL || 'http://localhost:3000',
    }
  },
  plugins: [react()],
})
