import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { SupplierTable } from '@/components/supplier/supplier-table'

export const dynamic = 'force-dynamic'

async function getSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { nama: 'asc' },
    include: {
      _count: { select: { transactions: true } },
    },
  })
}

export default async function SupplierPage() {
  const suppliers = await getSuppliers()

  return (
    <MainLayout
      title="Manajemen Supplier"
      subtitle="Kelola data supplier Sahabat Seafood"
    >
      <SupplierTable suppliers={suppliers} />
    </MainLayout>
  )
}
