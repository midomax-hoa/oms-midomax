import { Link, useRouterState } from '@tanstack/react-router'
import { icons, type LucideIcon } from 'lucide-react'
import { Separator } from '@workspace/ui'
import { APP_NAME, menuItems } from '@/lib/constants'
import type { MenuItem } from '@/types'

function getIcon(name: string): LucideIcon {
  return (icons as Record<string, LucideIcon>)[name] ?? icons.Circle
}

function SidebarItem({ item, isActive }: { item: MenuItem; isActive: boolean }) {
  const Icon = getIcon(item.icon)

  if (item.disabled) {
    return (
      <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </div>
    )
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'bg-[#2e3d95] text-white'
          : 'text-gray-300 hover:bg-white/10'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
  )
}

export function Sidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <aside className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-14 items-center px-4 font-bold text-lg">
        {APP_NAME}
      </div>
      <Separator className="bg-gray-700" />
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuItems.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
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
    </aside>
  )
}
