import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), //He’s the one who makes the visual magic happennnnnnn
  ],
  server: {
    proxy: {
      '/api': 'https://uni-desapego-d2od.onrender.com'
    }
  }
})