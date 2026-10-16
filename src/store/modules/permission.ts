import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router/routers.js'

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
        // 动态导入避免与 layout/index.vue 形成 ESM 循环依赖（layout → Sidebar → permission → layout）
        router.component = () => import('@/layout/index.vue')
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
