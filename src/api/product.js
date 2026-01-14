import { api } from 'boot/axios'

export function getProducts() {
  return api.get('/api/v1/products')
}

export function restockProduct(productId, quantity) {
  return api.post(`/api/v1/products/${productId}/restock`, { quantity })
}

export function createProduct(data) {
  return api.post('/api/v1/products', data)
}

export function updateProduct(productId, data) {
  return api.put(`/api/v1/products/${productId}`, data)
}

export function deleteProduct(productId) {
  return api.delete(`/api/v1/products/${productId}`)
}
