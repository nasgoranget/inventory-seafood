'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  Users,
  History,
  BarChart3,
  Settings,
  Fish,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Produk',
    href: '/produk',
    icon: Package,
  },
  {
    label: 'Stok & Mutasi',
    href: '/stok',
    icon: ArrowLeftRight,
  },
  {
    label: 'Supplier',
    href: '/supplier',
    icon: Truck,
  },
  {
    label: 'Customer',
    href: '/customer',
    icon: Users,
  },
  {
    label: 'Histori Transaksi',
    href: '/histori',
    icon: History,
  },
  {
    label: 'Laporan',
    href: '/laporan',
    icon: BarChart3,
  },
  {
    label: 'Pengaturan',
    href: '/pengaturan',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="bg-cyan-500 rounded-lg p-2">
          <Fish className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight">Sahabat Seafood</h1>
          <p className="text-xs text-slate-400">Manajemen Inventori</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-cyan-400' : '')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          © 2024 Sahabat Seafood
        </p>
      </div>
    </aside>
  )
}
