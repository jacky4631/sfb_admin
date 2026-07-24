import { defineStore } from 'pinia'

interface UserState {
  token: string
  roles: string[]
  permissions: string[]
  userInfo: any
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    roles: [],
    permissions: [],
    userInfo: null
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setRoles(roles: string[]) {
      this.roles = roles
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    hasRole(roles: string[]) {
      return roles.some(role => this.roles.includes(role))
    },
    hasPermi(permissions: string[]) {
      return permissions.some(perm => this.permissions.includes(perm))
    }
  },
  persist: true
})
