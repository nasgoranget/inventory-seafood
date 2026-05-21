'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, Phone, MessageCircle, MapPin } from 'lucide-react'
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
import { CustomerForm } from './customer-form'
import { deleteCustomer } from '@/app/customer/actions'
import { useToast } from '@/components/ui/use-toast'

interface Customer {
  id: string
  nama: string
  tipe: string
  kontak: string | null
  whatsapp: string | null
  alamat: string | null
  catatan: string | null
  _count?: { transactions: number }
}

interface CustomerTableProps {
  customers: Customer[]
}

function getTipeBadgeVariant(tipe: string) {
  switch (tipe) {
    case 'Hotel': return 'info'
    case 'Restoran': return 'info'
    case 'Grosir': return 'default'
    case 'Catering': return 'warning'
    default: return 'secondary'
  }
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const result = await deleteCustomer(id)
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    } else {
      toast({ title: 'Berhasil', description: 'Customer berhasil dihapus' })
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
          Tambah Customer
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-medium">Belum ada customer</p>
          <p className="text-sm mt-1">Tambah customer pertama Anda</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Nama Customer</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Total Transaksi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800">{customer.nama}</p>
                      {customer.catatan && (
                        <p className="text-xs text-slate-400 mt-0.5">{customer.catatan}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTipeBadgeVariant(customer.tipe) as 'info' | 'default' | 'warning' | 'secondary'}>
                      {customer.tipe}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.kontak && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Phone className="h-3 w-3" />
                          {customer.kontak}
                        </div>
                      )}
                      {customer.whatsapp && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <MessageCircle className="h-3 w-3" />
                          {customer.whatsapp}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.alamat ? (
                      <div className="flex items-start gap-1 text-sm text-slate-500 max-w-[200px]">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{customer.alamat}</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {customer._count?.transactions ?? 0} transaksi
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditCustomer(customer)}
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
                            <AlertDialogTitle>Hapus Customer</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus customer &quot;{customer.nama}&quot;?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(customer.id)}
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
            <DialogTitle>Tambah Customer Baru</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSuccess={() => setAddOpen(false)}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCustomer} onOpenChange={(open) => !open && setEditCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editCustomer && (
            <CustomerForm
              customer={editCustomer}
              onSuccess={() => setEditCustomer(null)}
              onCancel={() => setEditCustomer(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
