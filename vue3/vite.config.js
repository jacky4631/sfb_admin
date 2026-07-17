import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  publicPath: '/',
  base: '/',
  server: {
    port: 8013,
    open: false,
    proxy: {
      '/api': {
        target: process.env.VITE_APP_BASE_API || 'https://sfbadmin.mailvor.cn/admin',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'api')
      },
      '/auth': {
        target: process.env.VITE_APP_BASE_API || 'https://sfbadmin.mailvor.cn/admin',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, 'auth')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'echarts': ['echarts', 'echarts-gl', 'echarts-wordcloud']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@crud': resolve(__dirname, 'src/components/Crud')
    },
    extensions: ['.js', '.vue', '.json']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/contaner.scss" as *;`
      }
    }
  }
})
