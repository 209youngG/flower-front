import { api } from 'boot/axios'

export function createOrder(data) {
  return api.post('/api/v1/orders', data)
}
