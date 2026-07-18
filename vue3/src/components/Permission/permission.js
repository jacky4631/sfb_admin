import { useUserStore } from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const roles = useUserStore().roles
    if (!value || !(value instanceof Array) || value.length === 0) {
      // 没有传入权限要求时，不做权限检查，直接显示
      return
    }
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
