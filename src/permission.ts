import router from './router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { useNProgress } from '@/hooks/web/useNProgress'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const { start, done } = useNProgress()

// 白名单路由
const whiteList = ['/login', '/404', '/403']

router.beforeEach(async (to, from, next) => {
  start()
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      done()
    } else {
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // await userStore.getUserInfo()
          next()
        } catch (error) {
          ElMessage.error('获取用户信息失败')
          next('/login')
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  done()
})

router.afterEach(() => {
  done()
})
