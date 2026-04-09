import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, getErrorMessage } from '../lib/api'
import { Button, Card, Input, Label } from '../components/ui'

export function VerifyOtpPage() {
  const [params] = useSearchParams()
  const initialEmail = useMemo(() => params.get('email') ?? '', [params])
  const initialUserId = useMemo(() => Number(params.get('userId') ?? ''), [params])

  const [email, setEmail] = useState(initialEmail)
  const [userId, setUserId] = useState<number>(initialUserId || 0)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-semibold text-white">Verify OTP</h1>
      <Card>
        <div className="space-y-3">
          <div>
            <Label>User ID</Label>
            <Input
              value={userId || ''}
              onChange={(e) => setUserId(Number(e.target.value))}
              inputMode="numeric"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <Label>OTP</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              placeholder="6-digit code"
              required
            />
          </div>

          {error ? <div className="text-sm text-red-300">{error}</div> : null}
          {success ? <div className="text-sm text-green-300">{success}</div> : null}

          <div className="flex gap-2">
            <Button
              variant="primary"
              disabled={loading}
              onClick={async () => {
                setError(null)
                setSuccess(null)
                setLoading(true)
                try {
                  await api.post('/auth/verify-otp', { userId, otp: Number(otp) })
                  setSuccess('Email verified. You can now login.')
                } catch (err) {
                  setError(getErrorMessage(err))
                } finally {
                  setLoading(false)
                }
              }}
              className="flex-1"
            >
              Verify
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                setError(null)
                setSuccess(null)
                setLoading(true)
                try {
                  await api.post('/auth/resend-otp', { email })
                  setSuccess('OTP resent.')
                } catch (err) {
                  setError(getErrorMessage(err))
                } finally {
                  setLoading(false)
                }
              }}
            >
              Resend
            </Button>
          </div>

          <div className="text-sm text-zinc-400">
            <Link className="text-white underline underline-offset-4" to="/login">
              Back to login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

