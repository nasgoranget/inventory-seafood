import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">Admin</p>
          <p className="text-xs text-slate-500">Sahabat Seafood</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
      </div>
    </header>
  )
}
