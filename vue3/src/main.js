import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import permission from './components/Permission'

// 代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import '@/assets/font_icon/iconfont.css'
import '@/assets/styles/index.scss'

import App from './App'
import router from './router'
import pinia from './store'
import './router/permission'

const app = createApp(App)

app.use(pinia)
app.use(router)
// 代码高亮自定义指令
app.directive('highlight', {
  mounted(el) {
    el.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  },
  updated(el) {
    el.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  }
})
app.use(mavonEditor)
app.use(permission)
app.use(dict)
// 全局注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  size: Cookies.get('size') || 'small',
  locale: zhCn
})

// Register SvgIcon globally
import SvgIcon from './components/SvgIcon/index.vue'
app.component('svg-icon', SvgIcon)

app.mount('#app')