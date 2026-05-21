'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { supplierSchema } from '@/lib/validations'

export async function createSupplier(data: unknown) {
  const parsed = supplierSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    await prisma.supplier.create({
      data: {
        ...parsed.data,
        kontak: parsed.data.kontak || null,
        whatsapp: parsed.data.whatsapp || null,
        alamat: parsed.data.alamat || null,
        produkUtama: parsed.data.produkUtama || null,
        catatan: parsed.data.catatan || null,
      },
    })

    revalidatePath('/supplier')
    return { success: true }
  } catch {
    return { error: 'Gagal membuat supplier' }
  }
}

export async function updateSupplier(id: string, data: unknown) {
  const parsed = supplierSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    await prisma.supplier.update({
      where: { id },
      data: {
        ...parsed.data,
        kontak: parsed.data.kontak || null,
        whatsapp: parsed.data.whatsapp || null,
        alamat: parsed.data.alamat || null,
        produkUtama: parsed.data.produkUtama || null,
        catatan: parsed.data.catatan || null,
      },
    })

    revalidatePath('/supplier')
    return { success: true }
  } catch {
    return { error: 'Gagal memperbarui supplier' }
  }
}

export async function deleteSupplier(id: string) {
  try {
    const txCount = await prisma.stockTransaction.count({ where: { supplierId: id } })
    if (txCount > 0) {
      return { error: 'Supplier tidak dapat dihapus karena memiliki riwayat transaksi' }
    }

    await prisma.supplier.delete({ where: { id } })

    revalidatePath('/supplier')
    return { success: true }
  } catch {
    return { error: 'Gagal menghapus supplier' }
  }
}
