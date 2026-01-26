import { api } from 'boot/axios'

export function processPayment(orderId, paymentMethod) {
  return api.post('/api/v1/payments', { orderId, paymentMethod })
}
