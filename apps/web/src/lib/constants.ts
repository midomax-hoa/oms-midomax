import type { MenuGroup } from '@/types'

export const APP_NAME = 'Midomax OMS'

export const menuItems: MenuGroup[] = [
  {
    group: 'Tổng Quan',
    items: [{ label: 'Bảng điều khiển', path: '/', icon: 'LayoutDashboard' }],
  },
  {
    group: 'Quản Lý',
    items: [
      { label: 'Đơn hàng', path: '/orders', icon: 'ShoppingCart' },
      { label: 'Sản phẩm', path: '/products', icon: 'Package' },
      { label: 'Kho hàng', path: '/warehouse', icon: 'Warehouse', disabled: true },
      { label: 'Khách hàng', path: '/customers', icon: 'Users', disabled: true },
    ],
  },
  {
    group: 'Cài Đặt',
    items: [
      { label: 'Cửa hàng', path: '/settings/store', icon: 'Store', disabled: true },
      { label: 'Tài khoản', path: '/settings/account', icon: 'UserCog', disabled: true },
      { label: 'Hệ thống', path: '/settings/system', icon: 'Settings', disabled: true },
    ],
  },
]
