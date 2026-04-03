import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui'
import { Bell, LogOut, User } from 'lucide-react'

export function TopNavbar() {
  return (
    <header className="flex h-16 items-center justify-end gap-3 border-b border-border/50 bg-card/30 px-6">
      <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
        <Bell className="h-[18px] w-[18px]" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                H
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline">Harris</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="h-4 w-4" />
            Hồ sơ
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
