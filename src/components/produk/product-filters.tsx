'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useCallback } from 'react'

interface ProductFiltersProps {
  totalCount: number
  search: string
  kategori: string
}

export function ProductFilters({ totalCount, search, kategori }: ProductFiltersProps) {
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
      router.push(`/produk?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama produk atau SKU..."
            defaultValue={search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue={kategori} onValueChange={(val) => updateFilter('kategori', val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            <SelectItem value="Seafood">Seafood</SelectItem>
            <SelectItem value="Ayam">Ayam</SelectItem>
            <SelectItem value="Daging">Daging</SelectItem>
            <SelectItem value="Olahan">Olahan</SelectItem>
            <SelectItem value="Lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-slate-400 mt-2">
        Menampilkan {totalCount} produk
      </p>
    </div>
  )
}
