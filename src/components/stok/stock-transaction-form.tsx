'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stockTransactionSchema, type StockTransactionFormData } from '@/lib/validations'
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
import { createStockTransaction } from '@/app/stok/actions'

interface Product {
  id: string
  nama: string
  sku: string
  satuan: string
  stok: number
}

interface Supplier {
  id: string
  nama: string
}

interface Customer {
  id: string
  nama: string
}

interface StockTransactionFormProps {
  products: Product[]
  suppliers: Supplier[]
  customers: Customer[]
  onSuccess: () => void
  onCancel: () => void
}

export function StockTransactionForm({
  products,
  suppliers,
  customers,
  onSuccess,
  onCancel,
}: StockTransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockTransactionFormData>({
    resolver: zodResolver(stockTransactionSchema),
    defaultValues: {
      tanggal: today,
    },
  })

  const tipeValue = watch('tipe')
  const productId = watch('productId')
  const selectedProduct = products.find((p) => p.id === productId)

  const onSubmit = async (data: StockTransactionFormData) => {
    setLoading(true)
    try {
      const result = await createStockTransaction(data)
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Berhasil', description: 'Transaksi stok berhasil dicatat' })
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal">Tanggal *</Label>
          <Input
            id="tanggal"
            type="date"
            {...register('tanggal')}
            className="mt-1"
          />
          {errors.tanggal && <p className="text-xs text-red-500 mt-1">{errors.tanggal.message}</p>}
        </div>

        <div>
          <Label htmlFor="tipe">Tipe Transaksi *</Label>
          <Select onValueChange={(val) => setValue('tipe', val as StockTransactionFormData['tipe'])}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN">Barang Masuk (IN)</SelectItem>
              <SelectItem value="OUT">Barang Keluar (OUT)</SelectItem>
              <SelectItem value="ADJUSTMENT">Penyesuaian Stok</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipe && <p className="text-xs text-red-500 mt-1">{errors.tipe.message}</p>}
        </div>

        <div className="col-span-2">
          <Label htmlFor="productId">Produk *</Label>
          <Select onValueChange={(val) => setValue('productId', val)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih produk" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nama} ({p.sku}) - Stok: {p.stok} {p.satuan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productId && <p className="text-xs text-red-500 mt-1">{errors.productId.message}</p>}
          {selectedProduct && (
            <p className="text-xs text-slate-500 mt-1">
              Stok tersedia: <strong>{selectedProduct.stok} {selectedProduct.satuan}</strong>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="jumlah">
            Jumlah * {selectedProduct && `(${selectedProduct.satuan})`}
            {tipeValue === 'ADJUSTMENT' && <span className="text-slate-400 ml-1">(negatif = pengurangan)</span>}
          </Label>
          <Input
            id="jumlah"
            type="number"
            step="0.01"
            {...register('jumlah')}
            placeholder={tipeValue === 'ADJUSTMENT' ? '-5 atau 10' : '0'}
            className="mt-1"
          />
          {errors.jumlah && <p className="text-xs text-red-500 mt-1">{errors.jumlah.message}</p>}
        </div>

        <div>
          <Label htmlFor="referensi">No. Referensi</Label>
          <Input
            id="referensi"
            {...register('referensi')}
            placeholder="PO-2024-001"
            className="mt-1"
          />
        </div>

        {tipeValue === 'IN' && (
          <div className="col-span-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select onValueChange={(val) => setValue('supplierId', val)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih supplier (opsional)" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {tipeValue === 'OUT' && (
          <div className="col-span-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select onValueChange={(val) => setValue('customerId', val)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih customer (opsional)" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="col-span-2">
          <Label htmlFor="catatan">Catatan</Label>
          <Textarea
            id="catatan"
            {...register('catatan')}
            placeholder="Keterangan transaksi..."
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
          {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </Button>
      </div>
    </form>
  )
}
