import type { App } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// ElMessage / ElMessageBox / ElNotification / v-loading 都是 JS API 调用，
// 代码里是显式 import，会绕过 unplugin-vue-components 的 ElementPlusResolver，
// 样式不会被自动注入（弹窗会没有定位、没有遮罩地裸奔到页面左上角），必须手动引入
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/loading/style/css'

export function setupElementPlus(app: App) {
  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.use(ElementPlus, {
    size: 'small',
    locale: zhCn
  })
}
