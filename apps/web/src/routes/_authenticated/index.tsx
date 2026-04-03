import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui'
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { OrderStatusBadge, type OrderStatus } from '@/components/orders/order-status-badge'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})

interface StatItem {
  label: string
  value: string
  trend: string
  icon: LucideIcon
  trendColor: string
}

const stats: StatItem[] = [
  { label: 'Tổng đơn hàng', value: '1.247', trend: '+12%', icon: ShoppingCart, trendColor: 'text-emerald-400' },
  { label: 'Doanh thu', value: '324.500.000₫', trend: '+8%', icon: DollarSign, trendColor: 'text-emerald-400' },
  { label: 'Sản phẩm', value: '156', trend: '+3', icon: Package, trendColor: 'text-emerald-400' },
  { label: 'Khách hàng', value: '892', trend: '+24', icon: Users, trendColor: 'text-emerald-400' },
]

const recentOrders: Array<{ id: string; customer: string; total: string; status: OrderStatus }> = [
  { id: 'DH-001', customer: 'Nguyễn Văn An', total: '1.250.000₫', status: 'hoan_thanh' },
  { id: 'DH-002', customer: 'Trần Thị Bích', total: '3.450.000₫', status: 'dang_xu_ly' },
  { id: 'DH-003', customer: 'Lê Văn Cường', total: '890.000₫', status: 'cho_xac_nhan' },
  { id: 'DH-004', customer: 'Phạm Thị Dung', total: '2.100.000₫', status: 'dang_giao' },
  { id: 'DH-005', customer: 'Hoàng Văn Em', total: '4.780.000₫', status: 'da_huy' },
]

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bảng điều khiển</h1>
        <p className="text-sm text-muted-foreground mt-1">Tổng quan hoạt động kinh doanh</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/80 transition-all duration-200 hover:border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend}</span>
                <span className="text-xs text-muted-foreground">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium pl-6">Mã đơn</TableHead>
                <TableHead className="text-muted-foreground font-medium">Khách hàng</TableHead>
                <TableHead className="text-muted-foreground font-medium">Tổng tiền</TableHead>
                <TableHead className="text-muted-foreground font-medium">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-medium text-primary pl-6">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-mono tabular-nums">{order.total}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
