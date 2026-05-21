import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { CustomerTable } from '@/components/customer/customer-table'

export const dynamic = 'force-dynamic'

async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { nama: 'asc' },
    include: {
      _count: { select: { transactions: true } },
    },
  })
}

export default async function CustomerPage() {
  const customers = await getCustomers()

  return (
    <MainLayout
      title="Manajemen Customer"
      subtitle="Kelola data pelanggan Sahabat Seafood"
    >
      <CustomerTable customers={customers} />
    </MainLayout>
  )
}
