import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data
  await prisma.stockTransaction.deleteMany()
  await prisma.product.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.customer.deleteMany()

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        nama: 'PT. Sumber Laut Nusantara',
        kontak: 'Pak Hendra',
        whatsapp: '08123456789',
        alamat: 'Jl. Pelabuhan No. 12, Muara Baru, Jakarta Utara',
        produkUtama: 'Udang, Cumi, Ikan Laut',
        catatan: 'Supplier utama seafood segar',
      },
    }),
    prisma.supplier.create({
      data: {
        nama: 'CV. Frozen Prima',
        kontak: 'Bu Sari',
        whatsapp: '08234567890',
        alamat: 'Jl. Industri Raya No. 45, Cakung, Jakarta Timur',
        produkUtama: 'Ayam Frozen, Olahan Daging',
        catatan: 'Supplier produk ayam dan daging beku',
      },
    }),
    prisma.supplier.create({
      data: {
        nama: 'UD. Bahari Sejahtera',
        kontak: 'Pak Andi',
        whatsapp: '08345678901',
        alamat: 'Jl. Nelayan Baru No. 7, Penjaringan, Jakarta Utara',
        produkUtama: 'Ikan Bandeng, Ikan Kakap, Ikan Nila',
        catatan: 'Spesialis ikan air tawar dan laut',
      },
    }),
  ])

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        nama: 'Restoran Seafood Bahari',
        tipe: 'Restoran',
        kontak: 'Bu Diana',
        whatsapp: '08567890123',
        alamat: 'Jl. Kemang Raya No. 88, Jakarta Selatan',
        catatan: 'Pelanggan tetap, order rutin setiap minggu',
      },
    }),
    prisma.customer.create({
      data: {
        nama: 'Hotel Grand Pacific',
        tipe: 'Hotel',
        kontak: 'Chef Ahmad',
        whatsapp: '08678901234',
        alamat: 'Jl. MH Thamrin No. 10, Jakarta Pusat',
        catatan: 'Order besar setiap bulan untuk restoran hotel',
      },
    }),
    prisma.customer.create({
      data: {
        nama: 'Warung Makan Bu Tini',
        tipe: 'Warung',
        kontak: 'Bu Tini',
        whatsapp: '08789012345',
        alamat: 'Jl. Pasar Minggu No. 23, Jakarta Selatan',
        catatan: 'Pelanggan kecil, bayar tunai',
      },
    }),
    prisma.customer.create({
      data: {
        nama: 'Catering Bintang Lima',
        tipe: 'Catering',
        kontak: 'Pak Rudi',
        whatsapp: '08890123456',
        alamat: 'Jl. Condet Raya No. 56, Jakarta Timur',
        catatan: 'Catering acara besar, order dadakan',
      },
    }),
    prisma.customer.create({
      data: {
        nama: 'Grosir Frozen Pak Budi',
        tipe: 'Grosir',
        kontak: 'Pak Budi',
        whatsapp: '08901234567',
        alamat: 'Pasar Kramat Jati, Kios 45, Jakarta Timur',
        catatan: 'Reseller ke warung-warung kecil',
      },
    }),
  ])

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        nama: 'Udang Vaname Frozen',
        kategori: 'Seafood',
        sku: 'SFD-001',
        satuan: 'kg',
        hargaBeli: 85000,
        hargaJual: 110000,
        stok: 150,
        minStok: 20,
        aktif: true,
        catatan: 'Ukuran 50/60, kualitas premium',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Cumi-cumi Ring Frozen',
        kategori: 'Seafood',
        sku: 'SFD-002',
        satuan: 'kg',
        hargaBeli: 65000,
        hargaJual: 85000,
        stok: 80,
        minStok: 15,
        aktif: true,
        catatan: 'Sudah dipotong ring, siap goreng',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Ikan Kakap Fillet',
        kategori: 'Seafood',
        sku: 'SFD-003',
        satuan: 'kg',
        hargaBeli: 72000,
        hargaJual: 95000,
        stok: 10,
        minStok: 15,
        aktif: true,
        catatan: 'Fillet tanpa tulang, vacuum pack',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Kepiting Rajungan Frozen',
        kategori: 'Seafood',
        sku: 'SFD-004',
        satuan: 'kg',
        hargaBeli: 120000,
        hargaJual: 160000,
        stok: 45,
        minStok: 10,
        aktif: true,
        catatan: 'Rajungan utuh, ukuran besar',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Ayam Broiler Frozen',
        kategori: 'Ayam',
        sku: 'AYM-001',
        satuan: 'kg',
        hargaBeli: 28000,
        hargaJual: 38000,
        stok: 200,
        minStok: 50,
        aktif: true,
        catatan: 'Ayam utuh 1-1.2kg per ekor',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Dada Ayam Boneless',
        kategori: 'Ayam',
        sku: 'AYM-002',
        satuan: 'kg',
        hargaBeli: 35000,
        hargaJual: 48000,
        stok: 5,
        minStok: 20,
        aktif: true,
        catatan: 'Dada ayam tanpa tulang, vacuum pack',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Daging Sapi Giling',
        kategori: 'Daging',
        sku: 'DGG-001',
        satuan: 'kg',
        hargaBeli: 95000,
        hargaJual: 125000,
        stok: 60,
        minStok: 10,
        aktif: true,
        catatan: 'Daging sapi giling segar, beku',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Bakso Ikan Premium',
        kategori: 'Olahan',
        sku: 'OLH-001',
        satuan: 'pack',
        hargaBeli: 22000,
        hargaJual: 32000,
        stok: 120,
        minStok: 30,
        aktif: true,
        catatan: '500gr per pack, isi 20 biji',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Nugget Udang',
        kategori: 'Olahan',
        sku: 'OLH-002',
        satuan: 'pack',
        hargaBeli: 28000,
        hargaJual: 40000,
        stok: 0,
        minStok: 20,
        aktif: true,
        catatan: '400gr per pack, renyah dan gurih',
      },
    }),
    prisma.product.create({
      data: {
        nama: 'Fuyunghai Seafood Mix',
        kategori: 'Olahan',
        sku: 'OLH-003',
        satuan: 'pack',
        hargaBeli: 45000,
        hargaJual: 65000,
        stok: 35,
        minStok: 10,
        aktif: true,
        catatan: 'Mix seafood untuk masakan fusion',
      },
    }),
  ])

  // Create Stock Transactions
  const now = new Date()
  const daysAgo = (days: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - days)
    return d
  }

  const transactions = [
    // Stock IN - Udang Vaname
    {
      tanggal: daysAgo(25),
      tipe: 'IN',
      jumlah: 100,
      satuan: 'kg',
      referensi: 'PO-2024-001',
      catatan: 'Pembelian stok awal',
      productId: products[0].id,
      supplierId: suppliers[0].id,
    },
    {
      tanggal: daysAgo(10),
      tipe: 'IN',
      jumlah: 80,
      satuan: 'kg',
      referensi: 'PO-2024-008',
      catatan: 'Restock udang vaname',
      productId: products[0].id,
      supplierId: suppliers[0].id,
    },
    // Stock OUT - Udang Vaname
    {
      tanggal: daysAgo(20),
      tipe: 'OUT',
      jumlah: 20,
      satuan: 'kg',
      referensi: 'SO-2024-003',
      catatan: 'Pengiriman ke Restoran Bahari',
      productId: products[0].id,
      customerId: customers[0].id,
    },
    {
      tanggal: daysAgo(5),
      tipe: 'OUT',
      jumlah: 10,
      satuan: 'kg',
      referensi: 'SO-2024-012',
      catatan: 'Order Hotel Grand Pacific',
      productId: products[0].id,
      customerId: customers[1].id,
    },
    // Stock IN - Cumi-cumi
    {
      tanggal: daysAgo(20),
      tipe: 'IN',
      jumlah: 60,
      satuan: 'kg',
      referensi: 'PO-2024-002',
      catatan: 'Stok cumi-cumi ring',
      productId: products[1].id,
      supplierId: suppliers[0].id,
    },
    {
      tanggal: daysAgo(8),
      tipe: 'IN',
      jumlah: 40,
      satuan: 'kg',
      referensi: 'PO-2024-009',
      catatan: 'Restock cumi ring',
      productId: products[1].id,
      supplierId: suppliers[0].id,
    },
    // Stock OUT - Cumi-cumi
    {
      tanggal: daysAgo(15),
      tipe: 'OUT',
      jumlah: 15,
      satuan: 'kg',
      referensi: 'SO-2024-005',
      catatan: 'Pengiriman catering bintang lima',
      productId: products[1].id,
      customerId: customers[3].id,
    },
    {
      tanggal: daysAgo(3),
      tipe: 'OUT',
      jumlah: 5,
      satuan: 'kg',
      referensi: 'SO-2024-015',
      catatan: 'Penjualan warung bu tini',
      productId: products[1].id,
      customerId: customers[2].id,
    },
    // Stock IN - Ikan Kakap
    {
      tanggal: daysAgo(18),
      tipe: 'IN',
      jumlah: 40,
      satuan: 'kg',
      referensi: 'PO-2024-003',
      catatan: 'Stok ikan kakap fillet',
      productId: products[2].id,
      supplierId: suppliers[2].id,
    },
    // Stock OUT - Ikan Kakap (banyak keluar, stok menipis)
    {
      tanggal: daysAgo(12),
      tipe: 'OUT',
      jumlah: 20,
      satuan: 'kg',
      referensi: 'SO-2024-007',
      catatan: 'Order besar Hotel Grand Pacific',
      productId: products[2].id,
      customerId: customers[1].id,
    },
    {
      tanggal: daysAgo(6),
      tipe: 'OUT',
      jumlah: 10,
      satuan: 'kg',
      referensi: 'SO-2024-013',
      catatan: 'Restoran Bahari order mingguan',
      productId: products[2].id,
      customerId: customers[0].id,
    },
    // Stock IN - Ayam Broiler
    {
      tanggal: daysAgo(22),
      tipe: 'IN',
      jumlah: 150,
      satuan: 'kg',
      referensi: 'PO-2024-004',
      catatan: 'Stok ayam frozen',
      productId: products[4].id,
      supplierId: suppliers[1].id,
    },
    {
      tanggal: daysAgo(7),
      tipe: 'IN',
      jumlah: 100,
      satuan: 'kg',
      referensi: 'PO-2024-010',
      catatan: 'Restock ayam broiler',
      productId: products[4].id,
      supplierId: suppliers[1].id,
    },
    // Stock OUT - Ayam
    {
      tanggal: daysAgo(14),
      tipe: 'OUT',
      jumlah: 30,
      satuan: 'kg',
      referensi: 'SO-2024-006',
      catatan: 'Grosir Pak Budi ambil rutin',
      productId: products[4].id,
      customerId: customers[4].id,
    },
    {
      tanggal: daysAgo(4),
      tipe: 'OUT',
      jumlah: 20,
      satuan: 'kg',
      referensi: 'SO-2024-014',
      catatan: 'Catering Bintang Lima',
      productId: products[4].id,
      customerId: customers[3].id,
    },
    // Stock IN - Bakso Ikan
    {
      tanggal: daysAgo(16),
      tipe: 'IN',
      jumlah: 100,
      satuan: 'pack',
      referensi: 'PO-2024-005',
      catatan: 'Stok bakso ikan premium',
      productId: products[7].id,
      supplierId: suppliers[1].id,
    },
    // Stock OUT - Bakso Ikan
    {
      tanggal: daysAgo(9),
      tipe: 'OUT',
      jumlah: 30,
      satuan: 'pack',
      referensi: 'SO-2024-009',
      catatan: 'Warung Bu Tini order rutin',
      productId: products[7].id,
      customerId: customers[2].id,
    },
    // ADJUSTMENT
    {
      tanggal: daysAgo(2),
      tipe: 'ADJUSTMENT',
      jumlah: -5,
      satuan: 'kg',
      referensi: 'ADJ-2024-001',
      catatan: 'Penyesuaian stok - ada yang rusak/busuk',
      productId: products[0].id,
    },
    // Daging Sapi IN
    {
      tanggal: daysAgo(19),
      tipe: 'IN',
      jumlah: 60,
      satuan: 'kg',
      referensi: 'PO-2024-006',
      catatan: 'Stok daging sapi giling',
      productId: products[6].id,
      supplierId: suppliers[1].id,
    },
    // Nugget Udang IN (tapi sudah habis karena ada OUT)
    {
      tanggal: daysAgo(21),
      tipe: 'IN',
      jumlah: 50,
      satuan: 'pack',
      referensi: 'PO-2024-007',
      catatan: 'Stok awal nugget udang',
      productId: products[8].id,
      supplierId: suppliers[0].id,
    },
    {
      tanggal: daysAgo(11),
      tipe: 'OUT',
      jumlah: 50,
      satuan: 'pack',
      referensi: 'SO-2024-010',
      catatan: 'Habis terjual ke grosir',
      productId: products[8].id,
      customerId: customers[4].id,
    },
  ]

  for (const tx of transactions) {
    await prisma.stockTransaction.create({ data: tx })
  }

  console.log('✅ Seeding completed!')
  console.log(`   - ${suppliers.length} suppliers`)
  console.log(`   - ${customers.length} customers`)
  console.log(`   - ${products.length} products`)
  console.log(`   - ${transactions.length} transactions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
