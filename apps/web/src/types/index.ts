export interface MenuItem {
  label: string
  path: string
  icon: string
  disabled?: boolean
}

export interface MenuGroup {
  group: string
  items: MenuItem[]
}
