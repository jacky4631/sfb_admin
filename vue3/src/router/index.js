import { createRouter, createWebHistory } from 'vue-router'
import constantRouterMap from './routers'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { buildMenus } from '@/api/system/menu'
import { filterAsyncRouter } from '@/store/modules/permission'
import store from '@/store'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res)
    asyncRouter.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => {
      router.addRoute(asyncRouter)
      next({ ...to, replace: true })
    })
  }).catch(err => {
    console.log(err)
    store.dispatch('LogOut').then(() => {
      location.reload()
    })
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
      if (store.getters.roles && store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => {
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        })
      } else if (store.getters.loadMenus) {
        store.dispatch('updateLoadMenus').then(res => {})
        loadMenus(next, to)
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
