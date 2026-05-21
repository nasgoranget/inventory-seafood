import { Badge } from '@/components/ui/badge'
import { getStokStatus } from '@/lib/utils'

interface StockStatusBadgeProps {
  stok: number
  minStok: number
}

export function StockStatusBadge({ stok, minStok }: StockStatusBadgeProps) {
  const status = getStokStatus(stok, minStok)

  if (status === 'aman') {
    return <Badge variant="success">Aman</Badge>
  }
  if (status === 'menipis') {
    return <Badge variant="warning">Menipis</Badge>
  }
  return <Badge variant="danger">Habis</Badge>
}

interface TransactionTypeBadgeProps {
  tipe: string
}

export function TransactionTypeBadge({ tipe }: TransactionTypeBadgeProps) {
  if (tipe === 'IN') {
    return <Badge variant="success">Masuk</Badge>
  }
  if (tipe === 'OUT') {
    return <Badge variant="danger">Keluar</Badge>
  }
  return <Badge variant="warning">Penyesuaian</Badge>
}
