import { z } from 'zod'

export const productSchema = z.object({
  nama: z.string().min(1, 'Nama produk wajib diisi'),
  kategori: z.enum(['Seafood', 'Ayam', 'Daging', 'Olahan', 'Lainnya'], {
    required_error: 'Kategori wajib dipilih',
  }),
  sku: z.string().min(1, 'SKU wajib diisi'),
  satuan: z.enum(['kg', 'pcs', 'pack', 'dus', 'karton'], {
    required_error: 'Satuan wajib dipilih',
  }),
  hargaBeli: z.coerce.number().min(0, 'Harga beli tidak boleh negatif'),
  hargaJual: z.coerce.number().min(0, 'Harga jual tidak boleh negatif'),
  minStok: z.coerce.number().min(0, 'Minimum stok tidak boleh negatif'),
  aktif: z.boolean().default(true),
  catatan: z.string().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

export const supplierSchema = z.object({
  nama: z.string().min(1, 'Nama supplier wajib diisi'),
  kontak: z.string().optional(),
  whatsapp: z.string().optional(),
  alamat: z.string().optional(),
  produkUtama: z.string().optional(),
  catatan: z.string().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>

export const customerSchema = z.object({
  nama: z.string().min(1, 'Nama customer wajib diisi'),
  tipe: z.enum(['Retail', 'Grosir', 'Agen', 'Hotel', 'Restoran', 'Cafe', 'Catering', 'Warung', 'Reseller', 'Lainnya'], {
    required_error: 'Tipe customer wajib dipilih',
  }),
  kontak: z.string().optional(),
  whatsapp: z.string().optional(),
  alamat: z.string().optional(),
  catatan: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export const stockTransactionSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  productId: z.string().min(1, 'Produk wajib dipilih'),
  tipe: z.enum(['IN', 'OUT', 'ADJUSTMENT'], {
    required_error: 'Tipe transaksi wajib dipilih',
  }),
  jumlah: z.coerce.number().refine((val) => val !== 0, {
    message: 'Jumlah tidak boleh 0',
  }),
  referensi: z.string().optional(),
  supplierId: z.string().optional(),
  customerId: z.string().optional(),
  catatan: z.string().optional(),
})

export type StockTransactionFormData = z.infer<typeof stockTransactionSchema>
