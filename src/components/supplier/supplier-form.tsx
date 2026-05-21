'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supplierSchema, type SupplierFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { createSupplier, updateSupplier } from '@/app/supplier/actions'

interface Supplier {
  id: string
  nama: string
  kontak: string | null
  whatsapp: string | null
  alamat: string | null
  produkUtama: string | null
  catatan: string | null
}

interface SupplierFormProps {
  supplier?: Supplier
  onSuccess: () => void
  onCancel: () => void
}

export function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier
      ? {
          nama: supplier.nama,
          kontak: supplier.kontak || '',
          whatsapp: supplier.whatsapp || '',
          alamat: supplier.alamat || '',
          produkUtama: supplier.produkUtama || '',
          catatan: supplier.catatan || '',
        }
      : {},
  })

  const onSubmit = async (data: SupplierFormData) => {
    setLoading(true)
    try {
      const result = supplier
        ? await updateSupplier(supplier.id, data)
        : await createSupplier(data)

      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      } else {
        toast({
          title: 'Berhasil',
          description: supplier ? 'Supplier berhasil diperbarui' : 'Supplier berhasil ditambahkan',
        })
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
          <Label htmlFor="nama">Nama Supplier *</Label>
          <Input id="nama" {...register('nama')} placeholder="PT. Sumber Laut" className="mt-1" />
          {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>}
        </div>

        <div>
          <Label htmlFor="kontak">Nama Kontak</Label>
          <Input id="kontak" {...register('kontak')} placeholder="Pak Hendra" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" {...register('whatsapp')} placeholder="08123456789" className="mt-1" />
        </div>

        <div className="col-span-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea id="alamat" {...register('alamat')} placeholder="Alamat supplier..." className="mt-1" rows={2} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="produkUtama">Produk Utama</Label>
          <Input
            id="produkUtama"
            {...register('produkUtama')}
            placeholder="Udang, Cumi, Ikan Laut"
            className="mt-1"
          />
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
          {loading ? 'Menyimpan...' : supplier ? 'Perbarui Supplier' : 'Tambah Supplier'}
        </Button>
      </div>
    </form>
  )
}
