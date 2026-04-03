import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui'
import { ProductStatusBadge, type ProductStatus } from './product-status-badge'

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  image: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫'
}

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50 hover:bg-transparent">
          <TableHead className="w-[90px] text-muted-foreground font-medium whitespace-nowrap">Hình ảnh</TableHead>
          <TableHead className="text-muted-foreground font-medium">Sản phẩm</TableHead>
          <TableHead className="text-muted-foreground font-medium">Danh mục</TableHead>
          <TableHead className="text-right text-muted-foreground font-medium">Giá bán</TableHead>
          <TableHead className="text-right text-muted-foreground font-medium">Tồn kho</TableHead>
          <TableHead className="text-muted-foreground font-medium">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="border-border/30 hover:bg-muted/30 transition-colors">
            <TableCell>
              <img
                src={product.image}
                alt={product.name}
                className="h-10 w-10 rounded-md object-cover border border-border/50"
              />
            </TableCell>
            <TableCell>
              <div className="font-medium">{product.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>
            </TableCell>
            <TableCell className="text-muted-foreground">{product.category}</TableCell>
            <TableCell className="text-right font-mono tabular-nums">{formatPrice(product.price)}</TableCell>
            <TableCell className="text-right font-mono tabular-nums">{product.stock}</TableCell>
            <TableCell>
              <ProductStatusBadge status={product.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
