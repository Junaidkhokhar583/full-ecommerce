import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'

type Order = {
  id: number
  totalAmount: number
  status: string
  createdAt?: string
}

export function OrdersPage() {
  const q = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
  
      try {
        const res = await api.get('/order/orders')
        return (Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.items ?? []) as Order[]
      } catch {
        const res = await api.get('/order/order-status/PENDING')
        return (Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.items ?? []) as Order[]
      }
    },
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Orders</h1>
        <p className="text-sm text-zinc-400">Your order history.</p>
      </div>

      {q.isLoading ? <div className="text-sm text-zinc-400">Loading…</div> : null}
      {q.isError ? <div className="text-sm text-red-300">{getErrorMessage(q.error)}</div> : null}

      <div className="space-y-3">
        {(q.data ?? []).map((o) => (
          <Card key={o.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">Order #{o.id}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Status: {o.status} • Total: PKR {Number(o.totalAmount).toLocaleString()}
                </div>
              </div>
              <Link
                className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900"
                to={`/orders/${o.id}`}
              >
                View
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

