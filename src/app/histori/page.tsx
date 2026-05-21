import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { TransactionTypeBadge } from '@/components/status-badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTanggal } from '@/lib/utils'
import { HistoriFilters } from '@/components/histori/histori-filters'

export const dynamic = 'force-dynamic'

interface SearchParams {
  tipe?: string
  search?: string
  produkId?: string
  dari?: string
  sampai?: string
}

async function getTransactions(params: SearchParams) {
  const where: Record<string, unknown> = {}

  if (params.tipe && params.tipe !== 'semua') {
    where.tipe = params.tipe
  }

  if (params.produkId && params.produkId !== 'semua') {
    where.productId = params.produkId
  }

  if (params.dari || params.sampai) {
    where.tanggal = {}
    if (params.dari) {
      (where.tanggal as Record<string, Date>).gte = new Date(params.dari)
    }
    if (params.sampai) {
      const sampai = new Date(params.sampai)
      sampai.setHours(23, 59, 59)
      ;(where.tanggal as Record<string, Date>).lte = sampai
    }
  }

  if (params.search) {
    where.referensi = { contains: params.search }
  }

  return prisma.stockTransaction.findMany({
    where,
    orderBy: { tanggal: 'desc' },
    take: 100,
    include: {
      product: { select: { nama: true, sku: true } },
      supplier: { select: { nama: true } },
      customer: { select: { nama: true } },
    },
  })
}

async function getProducts() {
  return prisma.product.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: 'asc' },
  })
}

export default async function HistoriPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const [transactions, products] = await Promise.all([
    getTransactions(searchParams),
    getProducts(),
  ])

  const inCount = transactions.filter((t) => t.tipe === 'IN').length
  const outCount = transactions.filter((t) => t.tipe === 'OUT').length
  const adjCount = transactions.filter((t) => t.tipe === 'ADJUSTMENT').length

  return (
    <MainLayout
      title="Histori Transaksi"
      subtitle="Riwayat semua transaksi stok"
    >
      <HistoriFilters
        products={products}
        currentTipe={searchParams.tipe || 'semua'}
        currentSearch={searchParams.search || ''}
        currentProdukId={searchParams.produkId || 'semua'}
        currentDari={searchParams.dari || ''}
        currentSampai={searchParams.sampai || ''}
      />

      <div className="flex gap-3 my-4">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-green-700 font-semibold">{inCount}</span>
          <span className="text-green-600 ml-1">Masuk</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-red-600 font-semibold">{outCount}</span>
          <span className="text-red-500 ml-1">Keluar</span>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-yellow-700 font-semibold">{adjCount}</span>
          <span className="text-yellow-600 ml-1">Penyesuaian</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-slate-700 font-semibold">{transactions.length}</span>
          <span className="text-slate-500 ml-1">Total</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg font-medium">Tidak ada transaksi ditemukan</p>
              <p className="text-sm mt-1">Coba ubah filter pencarian</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Referensi</TableHead>
                  <TableHead>Supplier / Customer</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                      {formatTanggal(tx.tanggal)}
                    </TableCell>
                    <TableCell>
                      <TransactionTypeBadge tipe={tx.tipe} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">{tx.product.nama}</p>
                        <p className="text-xs text-slate-400">{tx.product.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          tx.tipe === 'IN'
                            ? 'text-green-600 font-semibold'
                            : tx.tipe === 'OUT'
                            ? 'text-red-500 font-semibold'
                            : 'text-yellow-600 font-semibold'
                        }
                      >
                        {tx.tipe === 'IN' ? '+' : tx.tipe === 'OUT' ? '-' : '±'}
                        {Math.abs(tx.jumlah)} {tx.satuan}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {tx.referensi || '-'}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {tx.supplier?.nama || tx.customer?.nama || '-'}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">
                      {tx.catatan || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}
