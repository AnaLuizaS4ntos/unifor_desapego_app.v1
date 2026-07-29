import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'UniDesapego UNIFOR',
        short_name: 'UniDesapego',
        description: 'Marketplace universitário e economia circular',
        theme_color: '#473469',
        background_color: '#F8F7FA',
        display: 'standalone',
        icons: [
          {
            src: '/Group 2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Group 2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})