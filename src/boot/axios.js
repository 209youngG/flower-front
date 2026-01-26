import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL
  // Vite proxy handles /api requests
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
api.interceptors.request.use((config) => {
  const user = LocalStorage.getItem('user')
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      LocalStorage.remove('user')
      
      if (window.location.hash.includes('admin')) {
        window.location.hash = '#/admin/login' 
      } else {
        window.location.hash = '#/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
