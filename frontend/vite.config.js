import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- É ele quem faz a mágica do visual acontecer!
  ],
  server: {
    proxy: {
      '/api': 'https://uni-desapego-d2od.onrender.com'
    }
  }
})