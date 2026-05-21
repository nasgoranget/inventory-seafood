import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { StockTable } from '@/components/stok/stock-table'

export const dynamic = 'force-dynamic'

async function getData() {
  const [transactions, products, suppliers, customers] = await Promise.all([
    prisma.stockTransaction.findMany({
      take: 50,
      orderBy: { tanggal: 'desc' },
      include: {
        product: { select: { nama: true, sku: true } },
        supplier: { select: { nama: true } },
        customer: { select: { nama: true } },
      },
    }),
    prisma.product.findMany({
      where: { aktif: true },
      select: { id: true, nama: true, sku: true, satuan: true, stok: true },
      orderBy: { nama: 'asc' },
    }),
    prisma.supplier.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: 'asc' },
    }),
    prisma.customer.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: 'asc' },
    }),
  ])

  return { transactions, products, suppliers, customers }
}

export default async function StokPage() {
  const { transactions, products, suppliers, customers } = await getData()

  return (
    <MainLayout
      title="Stok & Mutasi"
      subtitle="Catat transaksi barang masuk, keluar, dan penyesuaian stok"
    >
      <StockTable
        transactions={transactions}
        products={products}
        suppliers={suppliers}
        customers={customers}
      />
    </MainLayout>
  )
}
