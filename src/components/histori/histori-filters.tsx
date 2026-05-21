'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useCallback } from 'react'

interface Product {
  id: string
  nama: string
}

interface HistoriFiltersProps {
  products: Product[]
  currentTipe: string
  currentSearch: string
  currentProdukId: string
  currentDari: string
  currentSampai: string
}

export function HistoriFilters({
  products,
  currentTipe,
  currentSearch,
  currentProdukId,
  currentDari,
  currentSampai,
}: HistoriFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'semua') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/histori?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = () => {
    router.push('/histori')
  }

  const hasFilters = currentTipe !== 'semua' || currentSearch || currentProdukId !== 'semua' || currentDari || currentSampai

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <Label className="text-xs text-slate-500 mb-1 block">Tipe Transaksi</Label>
          <Select defaultValue={currentTipe} onValueChange={(val) => updateFilter('tipe', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Semua tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="IN">Masuk (IN)</SelectItem>
              <SelectItem value="OUT">Keluar (OUT)</SelectItem>
              <SelectItem value="ADJUSTMENT">Penyesuaian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-slate-500 mb-1 block">Produk</Label>
          <Select defaultValue={currentProdukId} onValueChange={(val) => updateFilter('produkId', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Semua produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Produk</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-slate-500 mb-1 block">Dari Tanggal</Label>
          <Input
            type="date"
            defaultValue={currentDari}
            onChange={(e) => updateFilter('dari', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs text-slate-500 mb-1 block">Sampai Tanggal</Label>
          <Input
            type="date"
            defaultValue={currentSampai}
            onChange={(e) => updateFilter('sampai', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs text-slate-500 mb-1 block">Cari Referensi</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="No. referensi..."
              defaultValue={currentSearch}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500">
            <X className="h-4 w-4 mr-1" />
            Hapus Filter
          </Button>
        </div>
      )}
    </div>
  )
}
