'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'

export async function createProduct(data: unknown) {
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    // Check SKU uniqueness
    const existing = await prisma.product.findUnique({
      where: { sku: parsed.data.sku },
    })
    if (existing) {
      return { error: 'SKU sudah digunakan' }
    }

    await prisma.product.create({
      data: {
        ...parsed.data,
        stok: 0,
      },
    })

    revalidatePath('/produk')
    revalidatePath('/dashboard')
    return { success: true }
  } catch {
    return { error: 'Gagal membuat produk' }
  }
}

export async function updateProduct(id: string, data: unknown) {
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    // Check SKU uniqueness (excluding current product)
    const existing = await prisma.product.findFirst({
      where: { sku: parsed.data.sku, NOT: { id } },
    })
    if (existing) {
      return { error: 'SKU sudah digunakan' }
    }

    await prisma.product.update({
      where: { id },
      data: parsed.data,
    })

    revalidatePath('/produk')
    revalidatePath('/dashboard')
    return { success: true }
  } catch {
    return { error: 'Gagal memperbarui produk' }
  }
}

export async function deleteProduct(id: string) {
  try {
    // Check if product has transactions
    const txCount = await prisma.stockTransaction.count({ where: { productId: id } })
    if (txCount > 0) {
      return { error: 'Produk tidak dapat dihapus karena memiliki riwayat transaksi' }
    }

    await prisma.product.delete({ where: { id } })

    revalidatePath('/produk')
    revalidatePath('/dashboard')
    return { success: true }
  } catch {
    return { error: 'Gagal menghapus produk' }
  }
}
