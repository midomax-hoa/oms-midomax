import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">San pham</h1>
      <p className="text-muted-foreground">Danh sach san pham se hien thi o day.</p>
    </div>
  )
}
