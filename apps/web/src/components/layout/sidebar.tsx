import { Link, useRouterState } from '@tanstack/react-router'
import { icons, type LucideIcon } from 'lucide-react'
import { menuItems } from '@/lib/constants'
import type { MenuItem } from '@/types'

function getIcon(name: string): LucideIcon {
  return (icons as Record<string, LucideIcon>)[name] ?? icons.Circle
}

function SidebarItem({ item, isActive }: { item: MenuItem; isActive: boolean }) {
  const Icon = getIcon(item.icon)

  if (item.disabled) {
    return (
      <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/40 cursor-not-allowed select-none">
        <Icon className="h-[18px] w-[18px]" />
        <span>{item.label}</span>
      </div>
    )
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent'
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
      <span>{item.label}</span>
    </Link>
  )
}

export function Sidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <aside className="flex h-full w-[260px] flex-col bg-card/50 border-r border-border/50">
      <div className="flex h-20 items-center px-6">
        <img src="/logo.svg" alt="Midomax" className="h-12 w-auto" />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuItems.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isActive={currentPath === item.path}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border/50 px-5 py-3">
        <p className="text-[11px] text-muted-foreground/50">v0.1.0</p>
      </div>
    </aside>
  )
}
