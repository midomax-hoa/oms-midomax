import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/')({
  component: OrdersPage,
})

function OrdersPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Don hang</h1>
      <p className="text-muted-foreground">Danh sach don hang se hien thi o day.</p>
    </div>
  )
}
