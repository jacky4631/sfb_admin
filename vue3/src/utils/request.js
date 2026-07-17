import axios from 'axios'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import Config from '@/settings'

const service = axios.create({
  baseURL: import.meta.env.DEV ? '/' : (import.meta.env.VITE_APP_BASE_API || '/admin'),
  timeout: Config.timeout,
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 401) {
        Cookies.remove('MSHOP-TOEKN')
        location.reload()
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    let message = error.message
    if (error.response && error.response.data) {
      message = error.response.data.message || error.response.data
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
