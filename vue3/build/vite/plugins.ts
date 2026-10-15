import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import progress from 'vite-plugin-progress'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export function createVitePlugins() {
  const plugins = [
    vue(),
    // UnoCSS
    UnoCSS(),
    // svg 雪碧图：把 src/assets/icons/svg 下的图标注册为 #icon-xxx，供 svg-icon 组件消费
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
      symbolId: 'icon-[name]'
    }),
    // 自动导入
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
      dirs: ['src/store']
    }),
    // 自动组件
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/types/auto-components.d.ts',
      deep: true
    }),
    progress()
  ]

  return plugins
}
