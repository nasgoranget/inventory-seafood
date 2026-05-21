import { prisma } from '@/lib/prisma'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductTable } from '@/components/produk/product-table'
import { ProductFilters } from '@/components/produk/product-filters'

export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  kategori?: string
}

async function getProducts(search?: string, kategori?: string) {
  return prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { nama: { contains: search } },
                { sku: { contains: search } },
              ],
            }
          : {},
        kategori && kategori !== 'semua' ? { kategori } : {},
      ],
    },
    orderBy: { nama: 'asc' },
  })
}

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const products = await getProducts(searchParams.search, searchParams.kategori)

  return (
    <MainLayout title="Manajemen Produk" subtitle="Kelola produk frozen food Anda">
      <div className="space-y-4">
        <ProductFilters
          totalCount={products.length}
          search={searchParams.search || ''}
          kategori={searchParams.kategori || 'semua'}
        />
        <ProductTable products={products} />
      </div>
    </MainLayout>
  )
}
