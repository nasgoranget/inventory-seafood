'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ProductForm } from './product-form'
import { StockStatusBadge } from '@/components/status-badge'
import { formatRupiah } from '@/lib/utils'
import { deleteProduct } from '@/app/produk/actions'
import { useToast } from '@/components/ui/use-toast'

interface Product {
  id: string
  nama: string
  kategori: string
  sku: string
  satuan: string
  hargaBeli: number
  hargaJual: number
  stok: number
  minStok: number
  aktif: boolean
  catatan: string | null
}

interface ProductTableProps {
  products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id)
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    } else {
      toast({ title: 'Berhasil', description: 'Produk berhasil dihapus' })
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-medium">Belum ada produk</p>
          <p className="text-sm mt-1">Tambah produk pertama Anda</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Produk</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Harga Beli</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800">{product.nama}</p>
                      {product.catatan && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{product.catatan}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.kategori}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-800">
                      {product.stok} {product.satuan}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">(min: {product.minStok})</span>
                  </TableCell>
                  <TableCell className="text-slate-600">{formatRupiah(product.hargaBeli)}</TableCell>
                  <TableCell className="font-medium text-slate-800">{formatRupiah(product.hargaJual)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <StockStatusBadge stok={product.stok} minStok={product.minStok} />
                      {!product.aktif && (
                        <Badge variant="outline" className="text-slate-400 w-fit">Nonaktif</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditProduct(product)}
                        className="h-8 w-8 text-slate-600 hover:text-cyan-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus produk &quot;{product.nama}&quot;?
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSuccess={() => setAddOpen(false)}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm
              product={editProduct}
              onSuccess={() => setEditProduct(null)}
              onCancel={() => setEditProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
