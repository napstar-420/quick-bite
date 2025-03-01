import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from "@quick-bite/app-config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://localhost:${config.API_PORT}`
    }
  }
})
