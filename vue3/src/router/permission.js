import router from './index'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const userStore = useUserStore()
      if (userStore.roles && userStore.roles.length === 0) {
        userStore.GetInfo().then(() => {
          next({ ...to, replace: true })
        }).catch(() => {
          userStore.LogOut().then(() => {
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
