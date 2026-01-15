import { api } from 'boot/axios'
import { ProductDto, ProductOptionDto, ProductAddonDto } from './types'

export function getProducts() {
  return api.get<ProductDto[]>('/api/v1/products')
}

export function getProduct(productId: number) {
  return api.get<ProductDto>(`/api/v1/products/${productId}`)
}

export function getProductOptions(productId: number) {
  return api.get<ProductOptionDto[]>(`/api/v1/products/${productId}/options`)
}

export function getAddons() {
  return api.get<ProductAddonDto[]>('/api/v1/products/addons')
}

export function restockProduct(productId: number, quantity: number) {
  return api.post<void>(`/api/v1/products/${productId}/restock`, { quantity })
}

export function createProduct(data: any) {
  return api.post<ProductDto>('/api/v1/products', data)
}

export function updateProduct(productId: number, data: any) {
  return api.put<ProductDto>(`/api/v1/products/${productId}`, data)
}

export function deleteProduct(productId: number) {
  return api.delete<void>(`/api/v1/products/${productId}`)
}
