import type { App } from 'vue'

/**
 * 权限指令
 * v-hasRole - 角色权限
 * v-hasPermi - 按钮权限
 */
export function setupAuth(app: App) {
  // 角色权限指令
  app.directive('hasRole', {
    mounted(el, binding) {
      const { value } = binding
      if (!value || !(value instanceof Array) || value.length === 0) {
        return
      }
      // 这里需要根据实际的用户信息来判断
      // const hasPermission = useUserStore().hasRole(value)
      // if (!hasPermission) {
      //   el.parentNode?.removeChild(el)
      // }
    }
  })

  // 按钮权限指令
  app.directive('hasPermi', {
    mounted(el, binding) {
      const { value } = binding
      if (!value || !(value instanceof Array) || value.length === 0) {
        return
      }
      // 这里需要根据实际的权限信息来判断
      // const hasPermission = useUserStore().hasPermi(value)
      // if (!hasPermission) {
      //   el.parentNode?.removeChild(el)
      // }
    }
  })
}

export default setupAuth
