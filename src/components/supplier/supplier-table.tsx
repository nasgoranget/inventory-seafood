'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, Phone, MessageCircle, MapPin, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { SupplierForm } from './supplier-form'
import { deleteSupplier } from '@/app/supplier/actions'
import { useToast } from '@/components/ui/use-toast'

interface Supplier {
  id: string
  nama: string
  kontak: string | null
  whatsapp: string | null
  alamat: string | null
  produkUtama: string | null
  catatan: string | null
  _count?: { transactions: number }
}

interface SupplierTableProps {
  suppliers: Supplier[]
}

export function SupplierTable({ suppliers }: SupplierTableProps) {
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const result = await deleteSupplier(id)
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    } else {
      toast({ title: 'Berhasil', description: 'Supplier berhasil dihapus' })
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
          Tambah Supplier
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-medium">Belum ada supplier</p>
          <p className="text-sm mt-1">Tambah supplier pertama Anda</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Nama Supplier</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Produk Utama</TableHead>
                <TableHead>Total Transaksi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800">{supplier.nama}</p>
                      {supplier.catatan && (
                        <p className="text-xs text-slate-400 mt-0.5">{supplier.catatan}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {supplier.kontak && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Phone className="h-3 w-3" />
                          {supplier.kontak}
                        </div>
                      )}
                      {supplier.whatsapp && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <MessageCircle className="h-3 w-3" />
                          {supplier.whatsapp}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {supplier.alamat ? (
                      <div className="flex items-start gap-1 text-sm text-slate-500 max-w-[200px]">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{supplier.alamat}</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {supplier.produkUtama ? (
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Package className="h-3 w-3" />
                        {supplier.produkUtama}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {supplier._count?.transactions ?? 0} transaksi
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditSupplier(supplier)}
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
                            <AlertDialogTitle>Hapus Supplier</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus supplier &quot;{supplier.nama}&quot;?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(supplier.id)}
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Supplier Baru</DialogTitle>
          </DialogHeader>
          <SupplierForm
            onSuccess={() => setAddOpen(false)}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editSupplier} onOpenChange={(open) => !open && setEditSupplier(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          {editSupplier && (
            <SupplierForm
              supplier={editSupplier}
              onSuccess={() => setEditSupplier(null)}
              onCancel={() => setEditSupplier(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
