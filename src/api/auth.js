import { api } from 'boot/axios'

export function login(email, password) {
  return api.post('/api/v1/members/login', { email, password })
}

export function register(data) {
  return api.post('/api/v1/members/register', data)
}
