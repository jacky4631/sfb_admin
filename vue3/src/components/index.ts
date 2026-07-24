import type { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue'
import ConfigGlobal from './ConfigGlobal/index.vue'
import CountUp from './CountUp/index.vue'

export function setupGlobCom(app: App) {
  // 注册SvgIcon全局组件
  app.component('svg-icon', SvgIcon)
  app.component('ConfigGlobal', ConfigGlobal)
  app.component('CountUp', CountUp)
}
