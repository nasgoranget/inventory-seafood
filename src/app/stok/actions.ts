'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { stockTransactionSchema } from '@/lib/validations'

export async function createStockTransaction(data: unknown) {
  const parsed = stockTransactionSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { tanggal, productId, tipe, jumlah, referensi, supplierId, customerId, catatan } = parsed.data

  try {
    // Get product
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return { error: 'Produk tidak ditemukan' }
    }

    // Calculate new stock
    let stockChange = 0
    if (tipe === 'IN') {
      stockChange = Math.abs(jumlah)
    } else if (tipe === 'OUT') {
      stockChange = -Math.abs(jumlah)
    } else {
      // ADJUSTMENT - jumlah bisa negatif
      stockChange = jumlah
    }

    const newStok = product.stok + stockChange

    // Validate OUT doesn't exceed stock
    if (tipe === 'OUT' && newStok < 0) {
      return { error: `Stok tidak mencukupi. Stok tersedia: ${product.stok} ${product.satuan}` }
    }

    // Create transaction and update stock atomically
    await prisma.$transaction([
      prisma.stockTransaction.create({
        data: {
          tanggal: new Date(tanggal),
          tipe,
          jumlah: tipe === 'OUT' ? -Math.abs(jumlah) : tipe === 'ADJUSTMENT' ? jumlah : Math.abs(jumlah),
          satuan: product.satuan,
          referensi: referensi || null,
          catatan: catatan || null,
          productId,
          supplierId: supplierId || null,
          customerId: customerId || null,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stok: Math.max(0, newStok) },
      }),
    ])

    revalidatePath('/stok')
    revalidatePath('/dashboard')
    revalidatePath('/produk')
    revalidatePath('/histori')
    return { success: true }
  } catch {
    return { error: 'Gagal membuat transaksi stok' }
  }
}
