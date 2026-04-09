import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getErrorMessage } from '../lib/api'
import { Button, Card, Input, Label } from '../components/ui'

export function RegisterPage() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-semibold text-white">Create account</h1>
      <Card>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setSuccess(null)
            setLoading(true)
            try {
              const res = await api.post('/auth/register', { name, email, password })
              const userId = res.data?.userId ?? res.data?.id
              if (!userId) throw new Error('Missing userId from register response')
              setSuccess('OTP sent. Please verify your email.')
              nav(`/verify-otp?userId=${encodeURIComponent(String(userId))}&email=${encodeURIComponent(email)}`)
            } catch (err) {
              setError(getErrorMessage(err))
            } finally {
              setLoading(false)
            }
          }}
        >
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
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
          {success ? <div className="text-sm text-green-300">{success}</div> : null}
          <Button variant="primary" type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating…' : 'Register'}
          </Button>
          <div className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link className="text-white underline underline-offset-4" to="/login">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

