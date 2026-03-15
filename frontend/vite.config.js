import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/employees': 'http://localhost:8000',
      '/performance': 'http://localhost:8000',
    },
  },
})
