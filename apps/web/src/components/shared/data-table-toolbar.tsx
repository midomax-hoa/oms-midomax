import type { ReactNode } from 'react'
import { Input } from '@workspace/ui'
import { Search } from 'lucide-react'

interface DataTableToolbarProps {
  searchPlaceholder?: string
  children?: ReactNode
}

export function DataTableToolbar({
  searchPlaceholder = 'Tim kiem...',
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={searchPlaceholder} className="pl-9" />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
