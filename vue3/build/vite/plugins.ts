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
      deep: true,
      // Crud 目录下组件均通过 @crud/xxx 别名显式导入；Pagination 同名组件冲突且所有使用处均已显式导入，均排除扫描
      globs: ['src/components/!(Crud|Pagination)/**/*.vue']
    }),
    progress()
  ]

  return plugins
}
