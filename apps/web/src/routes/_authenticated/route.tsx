import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TopNavbar } from '@/components/layout/top-navbar'
import { Sidebar } from '@/components/layout/sidebar'

export const Route = createFileRoute('/_authenticated')({
  // beforeLoad: async () => { /* Auth guard - Phase 4 */ },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
