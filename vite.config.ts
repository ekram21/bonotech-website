import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      // Local discovery/contact/newsletter/analytics → Bonotech mail API (or remote when unset).
      // Keep /admin/* API paths explicit so the SPA /admin route is not swallowed.
      '/send-email': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
      '/newsletter': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
      '/analytics': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
      '/admin/login': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
      '/admin/me': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
      '/admin/analytics': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
    },
  },
})
