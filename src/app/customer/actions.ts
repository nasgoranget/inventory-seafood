'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/lib/validations'

export async function createCustomer(data: unknown) {
  const parsed = customerSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    await prisma.customer.create({
      data: {
        ...parsed.data,
        kontak: parsed.data.kontak || null,
        whatsapp: parsed.data.whatsapp || null,
        alamat: parsed.data.alamat || null,
        catatan: parsed.data.catatan || null,
      },
    })

    revalidatePath('/customer')
    return { success: true }
  } catch {
    return { error: 'Gagal membuat customer' }
  }
}

export async function updateCustomer(id: string, data: unknown) {
  const parsed = customerSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    await prisma.customer.update({
      where: { id },
      data: {
        ...parsed.data,
        kontak: parsed.data.kontak || null,
        whatsapp: parsed.data.whatsapp || null,
        alamat: parsed.data.alamat || null,
        catatan: parsed.data.catatan || null,
      },
    })

    revalidatePath('/customer')
    return { success: true }
  } catch {
    return { error: 'Gagal memperbarui customer' }
  }
}

export async function deleteCustomer(id: string) {
  try {
    const txCount = await prisma.stockTransaction.count({ where: { customerId: id } })
    if (txCount > 0) {
      return { error: 'Customer tidak dapat dihapus karena memiliki riwayat transaksi' }
    }

    await prisma.customer.delete({ where: { id } })

    revalidatePath('/customer')
    return { success: true }
  } catch {
    return { error: 'Gagal menghapus customer' }
  }
}
