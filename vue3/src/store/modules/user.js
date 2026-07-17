import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    email: ''
  }),
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    }
  },
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
          const user = res.user
          const role = res.roles && res.roles.length > 0 ? res.roles : ['admin']
          this.roles = role
          this.name = user.name
          this.avatar = user.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          this.email = user.email
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
