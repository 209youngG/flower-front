import { api } from 'boot/axios'
import { CartDto } from './types'

export function getCart(memberId: number) {
  return api.get<CartDto>('/api/v1/carts', { params: { memberId } })
}

export function addToCart(memberId: number, productId: number, quantity: number) {
  return api.post<void>('/api/v1/carts/items', { memberId, productId, quantity })
}

export function updateCartItem(memberId: number, itemId: number, quantity: number) {
  return api.patch<void>(`/api/v1/carts/items/${itemId}`, { quantity }, { params: { memberId } })
}

export function removeCartItem(memberId: number, itemId: number) {
  return api.delete<void>(`/api/v1/carts/items/${itemId}`, { params: { memberId } })
}
