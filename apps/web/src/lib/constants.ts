import type { MenuGroup } from '@/types'

export const APP_NAME = 'MiDoMax OMS'

export const menuItems: MenuGroup[] = [
  {
    group: 'Tong Quan',
    items: [{ label: 'Dashboard', path: '/', icon: 'LayoutDashboard' }],
  },
  {
    group: 'Quan Ly',
    items: [
      { label: 'Don hang', path: '/orders', icon: 'ShoppingCart' },
      { label: 'San pham', path: '/products', icon: 'Package' },
      { label: 'Kho hang', path: '/warehouse', icon: 'Warehouse', disabled: true },
      { label: 'Khach hang', path: '/customers', icon: 'Users', disabled: true },
    ],
  },
  {
    group: 'Cai Dat',
    items: [
      { label: 'Cua hang', path: '/settings/store', icon: 'Store', disabled: true },
      { label: 'Tai khoan', path: '/settings/account', icon: 'UserCog', disabled: true },
      { label: 'He thong', path: '/settings/system', icon: 'Settings', disabled: true },
    ],
  },
]
