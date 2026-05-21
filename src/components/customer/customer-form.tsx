'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema, type CustomerFormData } from '@/lib/validations'
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
import { createCustomer, updateCustomer } from '@/app/customer/actions'

interface Customer {
  id: string
  nama: string
  tipe: string
  kontak: string | null
  whatsapp: string | null
  alamat: string | null
  catatan: string | null
}

interface CustomerFormProps {
  customer?: Customer
  onSuccess: () => void
  onCancel: () => void
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          nama: customer.nama,
          tipe: customer.tipe as CustomerFormData['tipe'],
          kontak: customer.kontak || '',
          whatsapp: customer.whatsapp || '',
          alamat: customer.alamat || '',
          catatan: customer.catatan || '',
        }
      : {},
  })

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true)
    try {
      const result = customer
        ? await updateCustomer(customer.id, data)
        : await createCustomer(data)

      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      } else {
        toast({
          title: 'Berhasil',
          description: customer ? 'Customer berhasil diperbarui' : 'Customer berhasil ditambahkan',
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
          <Label htmlFor="nama">Nama Customer *</Label>
          <Input id="nama" {...register('nama')} placeholder="Nama customer atau usaha" className="mt-1" />
          {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>}
        </div>

        <div className="col-span-2">
          <Label htmlFor="tipe">Tipe Customer *</Label>
          <Select
            defaultValue={customer?.tipe}
            onValueChange={(val) => setValue('tipe', val as CustomerFormData['tipe'])}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Pilih tipe customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Grosir">Grosir</SelectItem>
              <SelectItem value="Agen">Agen</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Restoran">Restoran</SelectItem>
              <SelectItem value="Cafe">Cafe</SelectItem>
              <SelectItem value="Catering">Catering</SelectItem>
              <SelectItem value="Warung">Warung</SelectItem>
              <SelectItem value="Reseller">Reseller</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipe && <p className="text-xs text-red-500 mt-1">{errors.tipe.message}</p>}
        </div>

        <div>
          <Label htmlFor="kontak">Nama Kontak</Label>
          <Input id="kontak" {...register('kontak')} placeholder="Nama kontak" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" {...register('whatsapp')} placeholder="08123456789" className="mt-1" />
        </div>

        <div className="col-span-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea id="alamat" {...register('alamat')} placeholder="Alamat customer..." className="mt-1" rows={2} />
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
          {loading ? 'Menyimpan...' : customer ? 'Perbarui Customer' : 'Tambah Customer'}
        </Button>
      </div>
    </form>
  )
}
