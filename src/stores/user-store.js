import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { login, register } from 'src/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: LocalStorage.getItem('user') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    memberId: (state) => state.user?.id,
    role: (state) => state.user?.role,
    isAdmin: (state) => ['ROOT_ADMIN', 'PRODUCT_ADMIN', 'DELIVERY_ADMIN'].includes(state.user?.role)
  },

  actions: {
    async login(loginId, password) {
      try {
        const response = await login(loginId, password)
        this.user = response.data
        LocalStorage.set('user', this.user)
        return true
      } catch (error) {
        console.error('Login failed', error)
        throw error
      }
    },

    async register(data) {
      try {
        const response = await register(data)
        this.user = response.data
        LocalStorage.set('user', this.user)
        return true
      } catch (error) {
        console.error('Registration failed', error)
        throw error
      }
    },

    logout() {
      this.user = null
      LocalStorage.remove('user')
    }
  }
})
