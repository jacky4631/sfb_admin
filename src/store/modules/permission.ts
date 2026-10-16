import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router/routers.js'
import Layout from '@/layout/index.vue'

interface PermissionState {
  routers: any[]
  addRouters: any[]
  loadMenus: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: constantRouterMap,
    addRouters: [],
    loadMenus: true
  }),
  actions: {
    GenerateRoutes(asyncRouter: any[]) {
      return new Promise(resolve => {
        this.addRouters = asyncRouter
        this.routers = [...constantRouterMap, ...asyncRouter]
        this.loadMenus = false
        resolve()
      })
    }
  }
})

export const filterAsyncRouter = (routers: any[]) => {
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

const viewModules = import.meta.glob('@/views/**/*.vue')

export const loadView = (view: string) => {
  const path = `/src/views/${view}.vue`
  if (!viewModules[path]) {
    console.error(`Cannot find view: ${path}`)
    return () => import('@/views/features/404.vue')
  }
  return viewModules[path]
}

export default usePermissionStore
