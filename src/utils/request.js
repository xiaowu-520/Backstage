// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTokenTime } from '@/utils/auth'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
}) // 创建一个axios的实例
const isTimeout = () => {
  const currentTime = Date.now()
  const tokenTime = getTokenTime()
  const timeout = 2 * 60 * 60 * 1000
  return currentTime - tokenTime > timeout
}
service.interceptors.request.use(async (config) => {
  if (store.getters.token) {
    if (isTimeout()) {
      console.log('token过期跳转登录页面')
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登录状态失效'))
    } else {
      config.headers.Authorization = 'Bearer ' + store.getters.token
    }
  }
  return config
}) // 请求拦截器
service.interceptors.response.use(
  (res) => {
    const { success, data, message } = res.data
    if (success) {
      return data
    }
    Message.error(message)
    return Promise.reject(new Error(message))
  },
  async (error) => {
    if (error?.response?.status === 401) {
      Message.error('登录状态失效')
      await store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
) // 响应拦截器
export default service // 导出axios实例
