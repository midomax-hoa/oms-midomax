import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { TopNavbar } from '@/components/layout/top-navbar'
import { Sidebar } from '@/components/layout/sidebar'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api'
    const response = await fetch(`${baseUrl}/me`, { credentials: 'include' })
    if (!response.ok) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
