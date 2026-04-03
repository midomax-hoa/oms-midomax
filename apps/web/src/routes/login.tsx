import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@workspace/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui'
import { Input } from '@workspace/ui'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" style={{ color: '#2e3d95' }}>
            MiDoMax OMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mat khau
              </label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">
              Dang nhap
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
