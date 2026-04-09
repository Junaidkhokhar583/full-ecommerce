import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Input, Label } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'

type CartItem = {
  productId: number
  quantity: number
  name: string
  price: number
  total: number
}

export function CartPage() {
  const nav = useNavigate()
  const qc = useQueryClient()

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart/')
      // backend returns an array of { productId, name, price, quantity, total }
      return res.data as CartItem[]
    },
  })

  const updateQty = useMutation({
    mutationFn: async (args: { productId: number; quantity: number }) => {
      await api.patch(`/cart/items/${args.productId}`, { quantity: args.quantity })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const removeItem = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/cart/items/${productId}`)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const placeOrder = useMutation({
    mutationFn: async () => {
      const res = await api.post('/order/order')
      return res.data as { message?: string; orderId?: number }
    },
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: ['cart'] })
      await qc.invalidateQueries({ queryKey: ['orders'] })
      if (data?.orderId) {
        nav(`/orders/${data.orderId}`)
      } else {
        nav('/orders')
      }
    },
  })

  const items = cartQuery.data ?? []
  const grandTotal = items.reduce((sum, it) => sum + Number(it.total ?? 0), 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Cart</h1>
        <p className="text-sm text-zinc-400">Your active cart.</p>
      </div>

      {cartQuery.isLoading ? <div className="text-sm text-zinc-400">Loading…</div> : null}
      {cartQuery.isError ? (
        <Card>
          <div className="text-sm text-red-300">Couldn’t load cart: {getErrorMessage(cartQuery.error)}</div>
          <div className="mt-3">
            <Link className="text-sm text-white underline underline-offset-4" to="/login">
              Go to login
            </Link>
          </div>
        </Card>
      ) : null}

      {cartQuery.data && items.length === 0 ? (
        <Card>
          <div className="text-sm text-zinc-300">Your cart is empty.</div>
          <div className="mt-3">
            <Link className="text-sm text-white underline underline-offset-4" to="/">
              Browse products
            </Link>
          </div>
        </Card>
      ) : null}

      {items.length ? (
        <div className="space-y-3">
          {items.map((it) => (
            <Card key={it.productId}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {it.name ?? `Product #${it.productId}`}
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">
                    Price: PKR {Number(it.price).toLocaleString()} • Line total:{' '}
                    PKR {Number(it.total).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-24">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        updateQty.mutate({ productId: it.productId, quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <Button variant="danger" onClick={() => removeItem.mutate(it.productId)}>
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {placeOrder.isError ? (
            <div className="text-sm text-red-300">{getErrorMessage(placeOrder.error)}</div>
          ) : null}

          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              Total:{' '}
              <span className="text-zinc-200">
                PKR {Number(grandTotal).toLocaleString()}
              </span>
            </div>
            <Button variant="primary" disabled={placeOrder.isPending} onClick={() => placeOrder.mutate()}>
              {placeOrder.isPending ? 'Placing…' : 'Place order'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

