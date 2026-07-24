import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    email: '',
    user: {},
  }),
  actions: {
    Login(userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          setToken(res.token, userInfo.rememberMe)
          this.token = res.token
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const role = res.roles && res.roles.length > 0 ? res.roles : ['admin']
          this.roles = role
          this.name = res.name
          this.avatar = res.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          this.email = res.email
          this.user = res
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    LogOut() {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          this.token = ''
          this.roles = []
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    FedLogOut() {
      return new Promise(resolve => {
        this.token = ''
        this.roles = []
        removeToken()
        resolve()
      })
    }
  }
})
