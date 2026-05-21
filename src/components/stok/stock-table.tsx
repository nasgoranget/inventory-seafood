'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { TransactionTypeBadge } from '@/components/status-badge'
import { formatTanggal } from '@/lib/utils'
import { StockTransactionForm } from './stock-transaction-form'

interface Transaction {
  id: string
  tanggal: Date
  tipe: string
  jumlah: number
  satuan: string
  referensi: string | null
  catatan: string | null
  product: { nama: string; sku: string }
  supplier: { nama: string } | null
  customer: { nama: string } | null
}

interface Product {
  id: string
  nama: string
  sku: string
  satuan: string
  stok: number
}

interface Supplier {
  id: string
  nama: string
}

interface Customer {
  id: string
  nama: string
}

interface StockTableProps {
  transactions: Transaction[]
  products: Product[]
  suppliers: Supplier[]
  customers: Customer[]
}

export function StockTable({ transactions, products, suppliers, customers }: StockTableProps) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-medium">Belum ada transaksi stok</p>
          <p className="text-sm mt-1">Mulai tambah transaksi masuk atau keluar</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Referensi</TableHead>
                <TableHead>Supplier / Customer</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-slate-600 whitespace-nowrap">
                    {formatTanggal(tx.tanggal)}
                  </TableCell>
                  <TableCell>
                    <TransactionTypeBadge tipe={tx.tipe} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800">{tx.product.nama}</p>
                      <p className="text-xs text-slate-400">{tx.product.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={
                      tx.tipe === 'IN'
                        ? 'text-green-600 font-semibold'
                        : tx.tipe === 'OUT'
                        ? 'text-red-500 font-semibold'
                        : 'text-yellow-600 font-semibold'
                    }>
                      {tx.tipe === 'IN' ? '+' : tx.tipe === 'OUT' ? '-' : '±'}
                      {Math.abs(tx.jumlah)} {tx.satuan}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-500">
                    {tx.referensi || '-'}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {tx.supplier?.nama || tx.customer?.nama || '-'}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">
                    {tx.catatan || '-'}
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
            <DialogTitle>Tambah Transaksi Stok</DialogTitle>
          </DialogHeader>
          <StockTransactionForm
            products={products}
            suppliers={suppliers}
            customers={customers}
            onSuccess={() => setAddOpen(false)}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
