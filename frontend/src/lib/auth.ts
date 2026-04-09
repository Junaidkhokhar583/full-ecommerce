export type JwtPayload = {
  sub?: number | string
  id?: number | string
  email?: string
  role?: string
  [k: string]: unknown
}

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  return atob(padded)
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    return JSON.parse(base64UrlDecode(payload))
  } catch {
    return null
  }
}

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function getCurrentUser() {
  const token = getToken()
  if (!token) return null
  const payload = decodeJwt(token)
  if (!payload) return null
  return {
    token,
    payload,
    role: typeof payload.role === 'string' ? payload.role : undefined,
    email: typeof payload.email === 'string' ? payload.email : undefined,
  }
}

