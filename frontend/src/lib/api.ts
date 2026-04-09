import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    const headers = (config.headers ?? {}) as Record<string, string>
    headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    config.headers = headers as any
  }
  return config
})

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg =
      (err.response?.data as any)?.message ||
      (err.response?.data as any)?.error ||
      err.message
    return Array.isArray(msg) ? msg.join(', ') : String(msg)
  }
  return err instanceof Error ? err.message : 'Something went wrong'
}

