import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' })

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL
  // Vite proxy handles /api requests
})

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

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

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Unauthorized
        LocalStorage.remove('user')
        router.push('/auth/login')
      }
      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
