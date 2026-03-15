import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const API_BASE = import.meta.env.VITE_API_URL

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': API_BASE,
      '/employees': API_BASE,
      '/performance': API_BASE,
    },
  },
})
