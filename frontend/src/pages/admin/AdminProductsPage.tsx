import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage } from '../../lib/api'
import { Button, Card, Input, Label } from '../../components/ui'

type Product = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  category: string
  isActive: boolean
}

export function AdminProductsPage() {
  const qc = useQueryClient()
  const [page] = useState(1)
  const [limit] = useState(50)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [stockQuantity, setStockQuantity] = useState<number>(0)
  const [category, setCategory] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [files, setFiles] = useState<FileList | null>(null)

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const productsQ = useQuery({
    queryKey: ['admin-products', page, limit],
    queryFn: async () => {
      const res = await api.get('/product/products', { params: { page, limit } })
      if (Array.isArray(res.data)) return res.data as Product[]
      return (res.data?.data ?? res.data?.items ?? res.data?.products ?? []) as Product[]
    },
  })

  const createM = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      const payload = { name, description, price, stockQuantity, category, isActive }
      fd.append('data', JSON.stringify(payload))
      const list = files ? Array.from(files).slice(0, 6) : []
      list.forEach((f) => fd.append('files', f))
      await api.post('/product/admin/product', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: async () => {
      setName('')
      setDescription('')
      setPrice(0)
      setStockQuantity(0)
      setCategory('')
      setIsActive(true)
      setFiles(null)
      await qc.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  const updateM = useMutation({
    mutationFn: async () => {
      if (!editingProduct) return

      const fd = new FormData()
      const payload = { name, description, price, stockQuantity, category, isActive }

      fd.append('data', JSON.stringify(payload))
      const list = files ? Array.from(files).slice(0, 6) : []
      list.forEach((f) => fd.append('files', f))

      await api.patch(`/product/admin/product/${editingProduct.id}`, {
  name,
  description,
  price,
  stockQuantity,
  category,
  isActive
})
    },
    onSuccess: async () => {
      setEditingProduct(null)
      setName('')
      setDescription('')
      setPrice(0)
      setStockQuantity(0)
      setCategory('')
      setIsActive(true)
      setFiles(null)

      await qc.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  const deleteM = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/product/admin/product/${productId}`)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  const products = productsQ.data ?? []

  const canSubmit = useMemo(
    () => name.trim() && description.trim() && category.trim(),
    [name, description, category]
  )

  const startEdit = (p: Product) => {
    setEditingProduct(p)
    setName(p.name)
    setDescription(p.description)
    setPrice(p.price)
    setStockQuantity(p.stockQuantity)
    setCategory(p.category)
    setIsActive(p.isActive)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Admin Products</h1>
        <p className="text-sm text-zinc-400">Create / delete products.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div>
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Images (up to 6)</Label>
            <input
              className="block w-full text-sm text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
            />
            <label htmlFor="isActive" className="text-sm text-zinc-300">
              Active
            </label>
          </div>

          {createM.isError ? <div className="sm:col-span-2 text-sm text-red-300">{getErrorMessage(createM.error)}</div> : null}
          {updateM.isError ? <div className="sm:col-span-2 text-sm text-red-300">{getErrorMessage(updateM.error)}</div> : null}

          <div className="sm:col-span-2 space-y-2">
            <Button
              variant="primary"
              disabled={(createM.isPending || updateM.isPending) || !canSubmit}
              onClick={() => {
                if (editingProduct) updateM.mutate()
                else createM.mutate()
              }}
              className="w-full"
            >
              {editingProduct
                ? updateM.isPending
                  ? 'Updating…'
                  : 'Update product'
                : createM.isPending
                ? 'Creating…'
                : 'Create product'}
            </Button>

            {editingProduct && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingProduct(null)
                  setName('')
                  setDescription('')
                  setPrice(0)
                  setStockQuantity(0)
                  setCategory('')
                  setIsActive(true)
                  setFiles(null)
                }}
                className="w-full"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </Card>

      {productsQ.isLoading ? <div className="text-sm text-zinc-400">Loading…</div> : null}
      {productsQ.isError ? <div className="text-sm text-red-300">{getErrorMessage(productsQ.error)}</div> : null}

      <div className="space-y-3">
        {products.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  #{p.id} • {p.name}
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  PKR {Number(p.price).toLocaleString()} • Stock {p.stockQuantity} • {p.category} •{' '}
                  {p.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => startEdit(p)}>Edit</Button>

                <Button
                  variant="danger"
                  onClick={() => deleteM.mutate(p.id)}
                  disabled={deleteM.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}