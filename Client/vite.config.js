import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd())

  return {
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL,
      },
    },
    plugins: [react()],
  }
})
