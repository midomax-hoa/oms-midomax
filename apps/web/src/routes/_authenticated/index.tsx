import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tong quan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chao mung den voi MiDoMax OMS.</p>
        </CardContent>
      </Card>
    </div>
  )
}
