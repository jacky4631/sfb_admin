import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import permission from './components/Permission'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import '@/assets/font_icon/iconfont.css'
import '@/assets/icons'
import '@/assets/styles/index.scss'

import App from './App'
import router from './router'
import pinia from './store'
import './router/permission'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueHighlightJS)
app.use(mavonEditor)
app.use(permission)
app.use(dict)
app.use(ElementPlus, {
  size: Cookies.get('size') || 'small',
  locale: zhCn
})

app.config.productionTip = false

app.mount('#app')
