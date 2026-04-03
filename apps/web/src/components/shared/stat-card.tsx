import { Card, CardContent } from '@workspace/ui'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  'dollar-sign': DollarSign,
  'shopping-cart': ShoppingCart,
  package: Package,
  users: Users,
  'trending-up': TrendingUp,
}

interface StatCardProps {
  label: string
  value: string
  trend: string
  icon: string
}

export function StatCard({ label, value, trend, icon }: StatCardProps) {
  const Icon = iconMap[icon] ?? Package
  const isPositive = trend.startsWith('+')

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p
              className={
                isPositive ? 'text-sm text-green-600' : 'text-sm text-muted-foreground'
              }
            >
              {trend}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
