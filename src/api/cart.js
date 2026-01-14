import { api } from 'boot/axios'

export function getCart(memberId) {
  return api.get('/api/v1/carts', { params: { memberId } })
}

export function addToCart(memberId, productId, quantity) {
  return api.post('/api/v1/carts/items', { memberId, productId, quantity })
}

export function updateCartItem(memberId, itemId, quantity) {
  return api.patch(`/api/v1/carts/items/${itemId}`, { quantity }, { params: { memberId } })
}

export function removeCartItem(memberId, itemId) {
  return api.delete(`/api/v1/carts/items/${itemId}`, { params: { memberId } })
}
