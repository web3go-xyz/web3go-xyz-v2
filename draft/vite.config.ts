import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  build: { sourcemap: true, },
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
      "@/": `${pathSrc}/`,
      "~@": `${pathSrc}/`,
    },
  },

  plugins: [
    vue(),
  ],
})
