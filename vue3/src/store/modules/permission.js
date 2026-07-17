import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router/routers'
import Layout from '@/layout/index'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routers: constantRouterMap,
    addRouters: [],
    loadMenus: true
  }),
  actions: {
    GenerateRoutes(asyncRouter) {
      return new Promise(resolve => {
        this.addRouters = asyncRouter
        this.routers = [...constantRouterMap, ...asyncRouter]
        this.loadMenus = false
        resolve()
      })
    }
  }
})

export const filterAsyncRouter = (routers) => {
  return routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        router.component = Layout
      } else {
        router.component = loadView(router.component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
}

export const loadView = (view) => {
  return () => import(`@/views/${view}.vue`)
}

export default usePermissionStore
