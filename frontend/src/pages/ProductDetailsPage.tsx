import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage } from '../lib/api'
import { Button, Card, Input, Label } from '../components/ui'

type Product = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  category: string
  isActive: boolean
  images?: string[]
}

export function ProductDetailsPage() {
  const { id } = useParams()
  const productId = useMemo(() => Number(id), [id])
  const [qty, setQty] = useState(1)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    enabled: Number.isFinite(productId) && productId > 0,
    queryFn: async () => {
      const res = await api.get(`/product/product/${productId}`)
      return res.data as Product
    },
  })

  const addToCart = useMutation({
    mutationFn: async () => {
      await api.post('/cart/items', { ProductId:productId, quantity: qty })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  if (isLoading) return <div className="text-sm text-zinc-400">Loading…</div>
  if (isError || !data) return <div className="text-sm text-red-300">Product not found.</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">{data.name}</h1>
        <p className="mt-1 text-sm text-zinc-400">{data.description}</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 text-sm">
            <div className="text-zinc-200">PKR {Number(data.price).toLocaleString()}</div>
            <div className="text-zinc-500">Category: {data.category}</div>
            <div className="text-zinc-500">Stock: {data.stockQuantity}</div>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              max={Math.max(1, data.stockQuantity)}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            {addToCart.isError ? (
              <div className="text-sm text-red-300">{getErrorMessage(addToCart.error)}</div>
            ) : null}
            <Button
              variant="primary"
              disabled={addToCart.isPending}
              onClick={() => addToCart.mutate()}
              className="w-full"
            >
              {addToCart.isPending ? 'Adding…' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

