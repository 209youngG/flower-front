import { defineStore } from 'pinia'
import { getCart, addToCart, updateCartItem, removeCartItem, updateCartItemOptions } from 'src/api/cart'
import { getProducts } from 'src/api/product'
import { createOrder } from 'src/api/order'
import { useUserStore } from './user-store'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    items: [],
    loading: false
  }),

  getters: {
    totalPrice: (state) => state.cart?.totalPrice || 0,
    totalQuantity: (state) => state.cart?.totalQuantity || 0
  },

  actions: {
    async loadCart() {
      const userStore = useUserStore()
      if (!userStore.isAuthenticated) {
        this.cart = null
        this.items = []
        return
      }

      this.loading = true
      try {
        const [cartRes, productRes] = await Promise.all([
          getCart(userStore.memberId),
          getProducts()
        ])

        this.cart = cartRes.data
        const products = productRes.data

        // 상품 정보 병합 (이름, 썸네일 등)
        this.items = (this.cart.items || []).map(item => {
          const product = products.find(p => p.id === item.productId)
          return {
            ...item,
            productName: product ? product.name : 'Unknown Product',
            thumbnailUrl: product ? product.thumbnailUrl : null
          }
        })
      } catch (error) {
        console.error('Failed to load cart', error)
      } finally {
        this.loading = false
      }
    },

    async addItem(productId, quantity = 1, optionIds = []) {
      const userStore = useUserStore()
      if (!userStore.isAuthenticated) throw new Error('로그인이 필요합니다.')

      await addToCart(userStore.memberId, productId, quantity, optionIds)
      await this.loadCart()
    },

    async updateItem(itemId, quantity) {
      const userStore = useUserStore()
      await updateCartItem(userStore.memberId, itemId, quantity)
      await this.loadCart()
    },

    async updateItemOptions(itemId, optionIds) {
      const userStore = useUserStore()
      await updateCartItemOptions(userStore.memberId, itemId, optionIds)
      await this.loadCart()
    },

    async removeItem(itemId) {
      const userStore = useUserStore()
      await removeCartItem(userStore.memberId, itemId)
      await this.loadCart()
    },
    
    async checkout(orderData) {
      // 주문 생성
      await createOrder(orderData)
      await this.loadCart() // 주문 후 장바구니 비워짐 -> 갱신
    }
  }
})
