import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { StatCard } from '@/components/stat-card'
import { TransactionTypeBadge, StockStatusBadge } from '@/components/status-badge'
import {
  Package,
  Layers,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTanggal } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const [
    totalProduk,
    products,
    barangMasuk,
    barangKeluar,
    recentTransactions,
  ] = await Promise.all([
    prisma.product.count({ where: { aktif: true } }),
    prisma.product.findMany({ select: { stok: true, minStok: true } }),
    prisma.stockTransaction.aggregate({
      where: {
        tipe: 'IN',
        tanggal: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { jumlah: true },
      _count: true,
    }),
    prisma.stockTransaction.aggregate({
      where: {
        tipe: 'OUT',
        tanggal: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { jumlah: true },
      _count: true,
    }),
    prisma.stockTransaction.findMany({
      take: 10,
      orderBy: { tanggal: 'desc' },
      include: {
        product: { select: { nama: true, satuan: true } },
        supplier: { select: { nama: true } },
        customer: { select: { nama: true } },
      },
    }),
  ])

  const totalStok = products.reduce((sum, p) => sum + p.stok, 0)
  const stokMenipis = products.filter((p) => p.stok > 0 && p.stok <= p.minStok).length
  const stokHabis = products.filter((p) => p.stok <= 0).length

  return {
    totalProduk,
    totalStok,
    stokMenipis,
    stokHabis,
    barangMasukCount: barangMasuk._count,
    barangKeluarCount: barangKeluar._count,
    recentTransactions,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Ringkasan inventori Sahabat Seafood"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Total Produk Aktif"
          value={data.totalProduk}
          icon={Package}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
        />
        <StatCard
          title="Total Stok"
          value={data.totalStok.toFixed(0)}
          subtitle="Semua satuan"
          icon={Layers}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Stok Menipis"
          value={data.stokMenipis}
          subtitle={`${data.stokHabis} produk habis`}
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-50"
        />
        <StatCard
          title="Barang Masuk"
          value={data.barangMasukCount}
          subtitle="Transaksi bulan ini"
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Barang Keluar"
          value={data.barangKeluarCount}
          subtitle="Transaksi bulan ini"
          icon={TrendingDown}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>Belum ada transaksi</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Pihak</TableHead>
                  <TableHead>Referensi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                      {formatTanggal(tx.tanggal)}
                    </TableCell>
                    <TableCell>
                      <TransactionTypeBadge tipe={tx.tipe} />
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {tx.product.nama}
                    </TableCell>
                    <TableCell>
                      <span className={
                        tx.tipe === 'IN'
                          ? 'text-green-600 font-semibold'
                          : tx.tipe === 'OUT'
                          ? 'text-red-500 font-semibold'
                          : 'text-yellow-600 font-semibold'
                      }>
                        {tx.tipe === 'IN' ? '+' : tx.tipe === 'OUT' ? '' : '±'}
                        {Math.abs(tx.jumlah)} {tx.product.satuan}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {tx.supplier?.nama || tx.customer?.nama || '-'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {tx.referensi || '-'}
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
