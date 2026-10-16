import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
import { login, logout, getInfo } from '@/api/login.js'

interface UserState {
  token: string
  roles: string[]
  permissions: string[]
  userInfo: any
  name: string
  avatar: string
  email: string
  user: Record<string, any>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken() || '',
    roles: [],
    permissions: [],
    userInfo: null,
    name: '',
    avatar: '',
    email: '',
    user: {}
  }),
  actions: {
    Login(userInfo: { username: string; password: string; code?: string; uuid?: string; rememberMe?: boolean }) {
      return login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then((res: any) => {
        setToken(res.token, userInfo.rememberMe)
        this.token = res.token
      })
    },
    GetInfo() {
      return getInfo().then((res: any) => {
        const roles = res.roles && res.roles.length > 0 ? res.roles : ['admin']
        this.roles = roles
        this.name = res.name || ''
        this.avatar = res.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        this.email = res.email || ''
        this.user = res
        this.userInfo = res
        return res
      })
    },
    LogOut() {
      return logout().finally(() => {
        this.resetUserState()
      })
    },
    FedLogOut() {
      this.resetUserState()
      return Promise.resolve()
    },
    resetUserState() {
      this.token = ''
      this.roles = []
      this.permissions = []
      this.userInfo = null
      this.name = ''
      this.avatar = ''
      this.email = ''
      this.user = {}
      removeToken()
    },
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
