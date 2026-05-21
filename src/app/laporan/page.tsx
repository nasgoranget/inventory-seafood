import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StockStatusBadge } from '@/components/status-badge'
import { formatRupiah } from '@/lib/utils'
import { BarChart3, TrendingDown, AlertTriangle, ShoppingCart } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getLaporanData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [products, topKeluar, barangMasukBulanIni, barangKeluarBulanIni] = await Promise.all([
    prisma.product.findMany({
      orderBy: { stok: 'asc' },
      include: {
        _count: { select: { transactions: true } },
      },
    }),
    prisma.stockTransaction.groupBy({
      by: ['productId'],
      where: { tipe: 'OUT' },
      _sum: { jumlah: true },
      _count: true,
      orderBy: { _sum: { jumlah: 'asc' } },
      take: 10,
    }),
    prisma.stockTransaction.findMany({
      where: { tipe: 'IN', tanggal: { gte: startOfMonth } },
      include: { product: { select: { nama: true, satuan: true } } },
      orderBy: { tanggal: 'desc' },
    }),
    prisma.stockTransaction.findMany({
      where: { tipe: 'OUT', tanggal: { gte: startOfMonth } },
      include: { product: { select: { nama: true, satuan: true } } },
      orderBy: { tanggal: 'desc' },
    }),
  ])

  // Get product details for top keluar
  const topKeluarWithProducts = await Promise.all(
    topKeluar.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { nama: true, satuan: true, kategori: true },
      })
      return {
        productId: item.productId,
        nama: product?.nama || '',
        satuan: product?.satuan || '',
        kategori: product?.kategori || '',
        totalKeluar: Math.abs(item._sum.jumlah || 0),
        transaksiCount: item._count,
      }
    })
  )

  const stokMenipis = products.filter((p) => p.stok > 0 && p.stok <= p.minStok)
  const stokHabis = products.filter((p) => p.stok <= 0)

  return {
    products,
    stokMenipis,
    stokHabis,
    topKeluar: topKeluarWithProducts.sort((a, b) => b.totalKeluar - a.totalKeluar),
    barangMasukBulanIni,
    barangKeluarBulanIni,
  }
}

export default async function LaporanPage() {
  const data = await getLaporanData()

  const totalNilaiStok = data.products.reduce(
    (sum, p) => sum + p.stok * p.hargaBeli,
    0
  )

  return (
    <MainLayout title="Laporan" subtitle="Ringkasan dan analitik inventori">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-50 rounded-lg p-2">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Nilai Stok</p>
              <p className="text-lg font-bold text-slate-800">{formatRupiah(totalNilaiStok)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 rounded-lg p-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Masuk Bulan Ini</p>
              <p className="text-lg font-bold text-slate-800">{data.barangMasukBulanIni.length} transaksi</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 rounded-lg p-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Keluar Bulan Ini</p>
              <p className="text-lg font-bold text-slate-800">{data.barangKeluarBulanIni.length} transaksi</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 rounded-lg p-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Perlu Restock</p>
              <p className="text-lg font-bold text-slate-800">
                {data.stokMenipis.length + data.stokHabis.length} produk
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stok Menipis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Produk Perlu Perhatian
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.stokMenipis.length === 0 && data.stokHabis.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                Semua produk stok aman
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Produk</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...data.stokHabis, ...data.stokMenipis].map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{p.nama}</p>
                          <p className="text-xs text-slate-400">{p.kategori}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.stok} / {p.minStok} {p.satuan}
                      </TableCell>
                      <TableCell>
                        <StockStatusBadge stok={p.stok} minStok={p.minStok} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Produk Keluar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Produk Paling Sering Keluar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.topKeluar.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                Belum ada data penjualan
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>#</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Total Keluar</TableHead>
                    <TableHead>Transaksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topKeluar.map((item, index) => (
                    <TableRow key={item.productId}>
                      <TableCell className="text-slate-500 font-semibold text-sm">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.nama}</p>
                          <p className="text-xs text-slate-400">{item.kategori}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-red-500 font-semibold text-sm">
                        {item.totalKeluar} {item.satuan}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {item.transaksiCount}x
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Ringkasan Stok Saat Ini */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Ringkasan Stok Semua Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Produk</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Nilai Stok (HPP)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-slate-800">{p.nama}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{p.sku}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.kategori}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {p.stok} {p.satuan}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatRupiah(p.stok * p.hargaBeli)}
                    </TableCell>
                    <TableCell>
                      <StockStatusBadge stok={p.stok} minStok={p.minStok} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
