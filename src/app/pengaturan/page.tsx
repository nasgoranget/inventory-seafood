import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Fish, MapPin, Phone, Mail, Info } from 'lucide-react'

export default function PengaturanPage() {
  return (
    <MainLayout title="Pengaturan" subtitle="Informasi dan konfigurasi sistem">
      <div className="max-w-2xl space-y-6">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Fish className="h-5 w-5 text-cyan-500" />
              Informasi Perusahaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="bg-cyan-500 rounded-xl p-3">
                <Fish className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800">Sahabat Seafood</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Distributor makanan beku premium di Indonesia
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">+62 21 xxxx xxxx</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">info@sahabatseafood.id</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-5 w-5 text-cyan-500" />
              Informasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Aplikasi', value: 'Sahabat Seafood Inventory' },
                { label: 'Versi', value: '1.0.0' },
                { label: 'Framework', value: 'Next.js 14 App Router' },
                { label: 'Database', value: 'SQLite (Prisma ORM)' },
                { label: 'UI Library', value: 'Tailwind CSS + Radix UI' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fitur Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                'Dashboard dengan statistik real-time',
                'Manajemen produk frozen food (CRUD)',
                'Pencatatan stok masuk, keluar, dan penyesuaian',
                'Manajemen supplier',
                'Manajemen customer',
                'Histori transaksi dengan filter lengkap',
                'Laporan stok dan analitik',
                'Validasi stok - tidak bisa keluar melebihi stok tersedia',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
