import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
