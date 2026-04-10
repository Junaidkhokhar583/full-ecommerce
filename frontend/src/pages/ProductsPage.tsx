import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Button, Card, Input } from '../components/ui'
import { useMemo, useState } from 'react'

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


export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [search, setSearch] = useState('')

  const queryKey = useMemo(() => ['products', page, limit, search], [page, limit, search])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (search.trim()) {
        const res = await api.get(`/product/search-product/${encodeURIComponent(search.trim())}`)
        return { items: res.data as Product[], total: (res.data as Product[])?.length ?? 0 }
      }
      const res = await api.get('/product/products', { params: { page, limit } })
      if (Array.isArray(res.data)) return { items: res.data as Product[], total: res.data.length }
      const items = (res.data?.data ?? res.data?.items ?? res.data?.products ?? []) as Product[]
      const total = Number(res.data?.total ?? res.data?.meta?.total ?? items.length)
      return { items, total }
    },
  })

  const items = data?.items ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Products</h1>
          <p className="text-sm text-zinc-400">Browse products and add items to your cart.</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-64"
          />
          <Button className='cursor-pointer' onClick={() => refetch()}>Search</Button>
        </div>
      </div>

      {isLoading ? <div className="text-sm text-zinc-400">Loading…</div> : null}
      {isError ? (
        <div className="text-sm text-red-300">Failed to load Products.</div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="mt-1 line-clamp-2 text-sm text-zinc-400">{p.description}</div>
                <div className="mt-2 text-sm text-zinc-200">
                  PKR {Number(p.price).toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Stock: {p.stockQuantity} • {p.category}
                </div>
              </div>
              <Link
                to={`/products/${p.id}`}
                className="shrink-0 rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900"
              >
                View
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {!search.trim() ? (
        <div className="flex items-center justify-between">
          <Button className='cursor-pointer' disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </Button>
          <div className="text-sm text-zinc-400">Page {page}</div>
          <Button className='cursor-pointer' onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      ) : null}
    </div>
  )
}

