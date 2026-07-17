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
  routes: constantRouterMap
})

export const loadMenus = (next, to) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res)
    asyncRouter.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
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
