import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { createVitePlugins } from './build/vite'
import { include, exclude } from './build/vite/optimize'

const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

export default ({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, root)

  const plugins = createVitePlugins()

  return {
    plugins,
    base: env.VITE_BASE_PATH || '/',
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss', '.css'],
      alias: {
        '@': pathResolve('src'),
        '@crud': pathResolve('src/components/Crud')
      }
    },
    server: {
      port: Number(env.VITE_PORT) || 8013,
      host: '0.0.0.0',
      open: env.VITE_OPEN === 'true',
      proxy: {
        '/api': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '/api')
        },
        '/auth': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/auth/, '/auth')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 使用 Sass 现代编译器 API，消除 legacy-js-api 弃用警告
          api: 'modern-compiler',
          additionalData: '@use "@/styles/variables.scss" as *;',
          javascriptEnabled: true
        }
      }
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true',
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'echarts': ['echarts', 'echarts-gl', 'echarts-wordcloud']
          }
        }
      }
    },
    optimizeDeps: { include, exclude }
  }
}
