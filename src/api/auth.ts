import { api } from 'boot/axios'

export function login(loginId: string, password: string) {
  return api.post<any>('/api/v1/members/login', { loginId, password })
}

export function register(data: any) {
  return api.post<any>('/api/v1/members/register', data)
}
