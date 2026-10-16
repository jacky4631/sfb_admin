import { createRouter, createWebHistory } from 'vue-router'
import constantRouterMap from './routers'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { buildMenus } from '@/api/system/menu'
import { filterAsyncRouter } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  // 注册兜底路由，避免动态菜单加载前初始导航触发 "No match found" 警告；
  // 注意不能用 redirect，否则解析阶段就跳走会丢失原始路径，破坏深层链接刷新
  routes: [...constantRouterMap, { path: '/:pathMatch(.*)*', component: () => import('@/views/features/404.vue'), hidden: true }]
})

export const loadMenus = (next, to) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res)
    permissionStore.GenerateRoutes(asyncRouter).then(() => {
      asyncRouter.forEach(route => router.addRoute(route))
      next({ ...to, replace: true })
    })
  }).catch(err => {
    console.log(err)
    userStore.FedLogOut()
    location.reload()
  })
}

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const userStore = useUserStore()
      if (userStore.roles && userStore.roles.length === 0) {
        userStore.GetInfo().then(res => {
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          userStore.FedLogOut()
          location.reload()
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
