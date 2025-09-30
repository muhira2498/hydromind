import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/hydromind/',   // 👈 use your repo name here
  server: {
    proxy: {
      '/api': {
        target: 'https://data.mrmhr.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})