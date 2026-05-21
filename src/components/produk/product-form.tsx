'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { createProduct, updateProduct } from '@/app/produk/actions'

interface Product {
  id: string
  nama: string
  kategori: string
  sku: string
  satuan: string
  hargaBeli: number
  hargaJual: number
  stok: number
  minStok: number
  aktif: boolean
  catatan: string | null
}

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          nama: product.nama,
          kategori: product.kategori as ProductFormData['kategori'],
          sku: product.sku,
          satuan: product.satuan as ProductFormData['satuan'],
          hargaBeli: product.hargaBeli,
          hargaJual: product.hargaJual,
          minStok: product.minStok,
          aktif: product.aktif,
          catatan: product.catatan || '',
        }
      : {
          aktif: true,
          hargaBeli: 0,
          hargaJual: 0,
          minStok: 0,
        },
  })

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    try {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data)

      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Berhasil', description: product ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan' })
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="nama">Nama Produk *</Label>
          <Input id="nama" {...register('nama')} placeholder="Nama produk" className="mt-1" />
          {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>}
        </div>

        <div>
          <Label htmlFor="kategori">Kategori *</Label>
          <Select
            defaultValue={product?.kategori}
            onValueChange={(val) => setValue('kategori', val as ProductFormData['kategori'])}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Seafood">Seafood</SelectItem>
              <SelectItem value="Ayam">Ayam</SelectItem>
              <SelectItem value="Daging">Daging</SelectItem>
              <SelectItem value="Olahan">Olahan</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          {errors.kategori && <p className="text-xs text-red-500 mt-1">{errors.kategori.message}</p>}
        </div>

        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" {...register('sku')} placeholder="SFD-001" className="mt-1" />
          {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
        </div>

        <div>
          <Label htmlFor="satuan">Satuan *</Label>
          <Select
            defaultValue={product?.satuan}
            onValueChange={(val) => setValue('satuan', val as ProductFormData['satuan'])}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih satuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="pcs">pcs</SelectItem>
              <SelectItem value="pack">pack</SelectItem>
              <SelectItem value="dus">dus</SelectItem>
              <SelectItem value="karton">karton</SelectItem>
            </SelectContent>
          </Select>
          {errors.satuan && <p className="text-xs text-red-500 mt-1">{errors.satuan.message}</p>}
        </div>

        <div>
          <Label htmlFor="minStok">Min. Stok *</Label>
          <Input
            id="minStok"
            type="number"
            step="0.01"
            {...register('minStok')}
            placeholder="0"
            className="mt-1"
          />
          {errors.minStok && <p className="text-xs text-red-500 mt-1">{errors.minStok.message}</p>}
        </div>

        <div>
          <Label htmlFor="hargaBeli">Harga Beli (Rp)</Label>
          <Input
            id="hargaBeli"
            type="number"
            {...register('hargaBeli')}
            placeholder="0"
            className="mt-1"
          />
          {errors.hargaBeli && <p className="text-xs text-red-500 mt-1">{errors.hargaBeli.message}</p>}
        </div>

        <div>
          <Label htmlFor="hargaJual">Harga Jual (Rp)</Label>
          <Input
            id="hargaJual"
            type="number"
            {...register('hargaJual')}
            placeholder="0"
            className="mt-1"
          />
          {errors.hargaJual && <p className="text-xs text-red-500 mt-1">{errors.hargaJual.message}</p>}
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="aktif"
            {...register('aktif')}
            className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
          />
          <Label htmlFor="aktif" className="cursor-pointer">Produk Aktif</Label>
        </div>

        <div className="col-span-2">
          <Label htmlFor="catatan">Catatan</Label>
          <Textarea
            id="catatan"
            {...register('catatan')}
            placeholder="Catatan opsional..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {loading ? 'Menyimpan...' : product ? 'Perbarui Produk' : 'Tambah Produk'}
        </Button>
      </div>
    </form>
  )
}
