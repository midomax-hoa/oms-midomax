import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui'
import { APP_NAME } from '@/lib/constants'

export function TopNavbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <span className="text-lg font-semibold">{APP_NAME}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#2e3d95]">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#2e3d95] text-white text-sm">
                U
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
