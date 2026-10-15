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
      config.headers['Authorization'] = token // 让每个请求携带自定义token
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
    const data = error.response && error.response.data
    // 导出等 responseType=blob 的请求，错误体是 Blob，直接当 message 用会显示成 [object Blob]
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      return data.text().then(text => {
        let message = text
        try {
          message = JSON.parse(text).message || message
        } catch (e) { /* 非 JSON 则保留原文 */ }
        ElMessage({
          message: message || error.message,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      })
    }
    let message = error.message
    if (data) {
      message = data.message || message
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
