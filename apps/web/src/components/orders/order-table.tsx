import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui'
import { OrderStatusBadge, type OrderStatus } from './order-status-badge'

export type Order = {
  id: string
  date: string
  customer: string
  total: number
  status: OrderStatus
  payment: string
  shipping: string
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫'
}

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50 hover:bg-transparent">
          <TableHead className="text-muted-foreground font-medium">Mã đơn</TableHead>
          <TableHead className="text-muted-foreground font-medium">Ngày tạo</TableHead>
          <TableHead className="text-muted-foreground font-medium">Khách hàng</TableHead>
          <TableHead className="text-right text-muted-foreground font-medium">Tổng tiền</TableHead>
          <TableHead className="text-muted-foreground font-medium">Trạng thái</TableHead>
          <TableHead className="text-muted-foreground font-medium">Thanh toán</TableHead>
          <TableHead className="text-muted-foreground font-medium">Vận chuyển</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="border-border/30 hover:bg-muted/30 transition-colors">
            <TableCell className="font-mono font-medium text-primary">{order.id}</TableCell>
            <TableCell className="text-muted-foreground">{order.date}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell className="text-right font-mono tabular-nums">{formatVND(order.total)}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{order.payment}</TableCell>
            <TableCell className="text-muted-foreground">{order.shipping}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
