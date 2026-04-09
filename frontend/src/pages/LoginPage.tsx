import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getErrorMessage } from '../lib/api'
import { setToken } from '../lib/auth'
import { Button, Card, Input, Label } from '../components/ui'

export function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-semibold text-white">Login</h1>
      <Card>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setLoading(true)
            try {
              const res = await api.post('/auth/login', { email, password })
              const rawToken =
                res.data?.token ?? res.data?.access_token ?? res.data?.accessToken
              if (!rawToken) throw new Error('Token not found in response')
              const str = String(rawToken)
              setToken(str.startsWith('Bearer ') ? str.slice('Bearer '.length) : str)
              nav('/')
            } catch (err) {
              setError(getErrorMessage(err))
            } finally {
              setLoading(false)
            }
          }}
        >
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          {error ? <div className="text-sm text-red-300">{error}</div> : null}
          <Button variant="primary" type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Login'}
          </Button>
          <div className="text-sm text-zinc-400">
            No account?{' '}
            <Link className="text-white underline underline-offset-4" to="/register">
              Register
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

