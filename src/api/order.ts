import { api } from 'boot/axios'
import { OrderDto, CreateOrderRequest } from './types'

export function createOrder(data: CreateOrderRequest) {
  return api.post<any>('/api/v1/orders', data)
}

export function createDirectOrder(data: any) {
  return api.post<any>('/api/v1/orders/direct', data)
}

export function getMyOrders(memberId: number) {
  return api.get<OrderDto[]>('/api/v1/orders/my', { params: { memberId } })
}

export function getOrder(orderId: number) {
  return api.get<OrderDto>(`/api/v1/orders/${orderId}`)
}

export function cancelOrder(orderId: number) {
  return api.post<void>(`/api/v1/orders/${orderId}/cancel`)
}
