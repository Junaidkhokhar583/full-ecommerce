import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Card } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'

export function OrderDetailsPage() {
  const { id } = useParams()
  const orderId = Number(id)

  const q = useQuery({
    queryKey: ['order', orderId],
    enabled: Number.isFinite(orderId) && orderId > 0,
    queryFn: async () => {
      const res = await api.get(`/order/orders/${orderId}`)
      return res.data as any
    },
  })

  if (q.isLoading) return <div className="text-sm text-zinc-400">Loading…</div>
  if (q.isError) return <div className="text-sm text-red-300">{getErrorMessage(q.error)}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-white">Order #{orderId}</h1>
      <Card>
        <pre className="overflow-auto text-xs text-zinc-200">{JSON.stringify(q.data, null, 2)}</pre>
      </Card>
    </div>
  )
}

