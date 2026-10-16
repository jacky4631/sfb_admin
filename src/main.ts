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
// 引入自定义图标字体（装修等页面 iconfont 字形）
import '@/assets/font_icon/iconfont.css'

// 路由
import router from '@/router'

// 指令
import { setupAuth } from '@/directives'
import { highlightjs } from '@/directives/highlightjs'

// 数据字典（页面 dicts 选项的全局 mixin）
import dict from '@/components/Dict'

// 按钮权限指令 v-permission
import permission from '@/components/Permission/index.vue'

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

  // 数据字典
  app.use(dict)

  // v-permission 指令
  app.use(permission)

  // v-highlightjs 指令（代码高亮）
  app.directive('highlightjs', highlightjs)

  await router.isReady()

  app.mount('#app')
}

setupAll()
