// 引入 unocss css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 引入状态管理
import pinia from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.scss'
// 引入布局等完整全局样式（sidebar / main-container / fixed-header 等）
import '@/assets/styles/index.scss'

// 路由
import router from '@/router'

// 指令
import { setupAuth } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

const setupAll = async () => {
  const app = createApp(App)

  // 状态管理
  app.use(pinia)

  // 全局组件
  setupGlobCom(app)

  // Element Plus
  setupElementPlus(app)

  // 路由
  app.use(router)

  // 指令
  setupAuth(app)

  await router.isReady()

  app.mount('#app')
}

setupAll()
