import router from './index'
import store from '@/store'
import { getToken } from '@/utils/auth'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles && store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(() => {
          next({ ...to, replace: true })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
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
    }
  }
})

export default router
