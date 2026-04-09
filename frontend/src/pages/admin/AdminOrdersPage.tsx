import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage } from '../../lib/api'
import { Button, Card, Input, Label } from '../../components/ui'
import { useState } from 'react'

type Order = {
  id: number
  status: string
  totalAmount: number
  userId?: number
}

export function AdminOrdersPage() {
  const qc = useQueryClient()
  const [orderId, setOrderId] = useState<number>(0)
  const [status, setStatus] = useState('CONFIRMED')

  const ordersQ = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/order/admin/orders')
      return (Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.items ?? []) as Order[]
    },
  })

  const updateM = useMutation({
    mutationFn: async () => {
      await api.patch(`/order/admin/orders/${orderId}/status`, { status })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-orders'] })
    },
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Admin Orders</h1>
        <p className="text-sm text-zinc-400">View all orders and update status.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label>Order ID</Label>
            <Input type="number" value={orderId || ''} onChange={(e) => setOrderId(Number(e.target.value))} />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="PENDING / CONFIRMED / CANCELLED" />
          </div>
          <div className="flex items-end">
            <Button variant="primary" disabled={updateM.isPending || !orderId} onClick={() => updateM.mutate()} className="w-full">
              {updateM.isPending ? 'Updating…' : 'Update status'}
            </Button>
          </div>
          {updateM.isError ? (
            <div className="sm:col-span-3 text-sm text-red-300">{getErrorMessage(updateM.error)}</div>
          ) : null}
        </div>
      </Card>

      {ordersQ.isLoading ? <div className="text-sm text-zinc-400">Loading…</div> : null}
      {ordersQ.isError ? <div className="text-sm text-red-300">{getErrorMessage(ordersQ.error)}</div> : null}

      <div className="space-y-3">
        {(ordersQ.data ?? []).map((o) => (
          <Card key={o.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">Order #{o.id}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Status: {o.status} • Total: PKR {Number(o.totalAmount).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

