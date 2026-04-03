# Phase 5: Pages Implementation

## Context

- [Brainstorm](../reports/brainstorm-260403-1224-oms-skeleton.md) — page specs
- Reference screenshots analyzed (Shopee/Salework OMS)
- Depends on: Phase 4

## Overview

- **Priority:** High
- **Status:** Pending
- **Description:** Implement 4 pages: Login, Dashboard, Order List, Product List with hardcoded data and shadcn/ui components.

## Key Design Rules

- UI must differ from reference screenshots
- Primary color: `#2e3d95` (dark blue)
- Data: electronics/fashion (NOT sports gear from reference)
- Vietnamese labels for menu/headers
- Use shadcn/ui components from `@workspace/ui`

## Pages Detail

### 5.1 Login Page

**Layout:** Centered card, no sidebar/navbar

**Components:**
- Logo/brand name at top
- Email input
- Password input
- "Dang nhap" button
- Error message display

**File:** `apps/web/src/routes/login.tsx`

### 5.2 Dashboard Page

**Layout:** Inside authenticated layout (navbar + sidebar)

**Components:**
- 4 stat cards row: Tong don hang, Doanh thu, San pham, Khach hang
- Each card: icon, value, label, trend indicator (hardcoded)
- Optional: simple recent orders table (top 5)

**File:** `apps/web/src/routes/_authenticated/index.tsx`

**Stat card data (hardcoded):**
```typescript
const stats = [
  { label: 'Tong don hang', value: '1,247', trend: '+12%', icon: 'ShoppingCart' },
  { label: 'Doanh thu', value: '324,500,000d', trend: '+8%', icon: 'DollarSign' },
  { label: 'San pham', value: '156', trend: '+3', icon: 'Package' },
  { label: 'Khach hang', value: '892', trend: '+24', icon: 'Users' },
]
```

### 5.3 Order List Page

**Layout:** Inside authenticated layout

**Components:**
- Page title: "Danh sach don hang"
- Tab bar: Tat ca (92) | Cho xac nhan (18) | Dang xu ly (25) | Dang giao (30) | Hoan thanh (15) | Da huy (4)
- Search bar + date range filter (UI only, no real filtering needed)
- Action buttons: "Hanh dong", "Xuat Excel"
- Data table columns: Ma don hang, Ngay tao, Khach hang, Tong tien, Trang thai, Thanh toan, Van chuyen
- Status badges (color-coded): cho_xac_nhan=yellow, dang_xu_ly=blue, dang_giao=orange, hoan_thanh=green, da_huy=red
- Pagination: 25 per page

**File:** `apps/web/src/routes/_authenticated/orders/index.tsx`

**Supporting components:**
- `apps/web/src/components/orders/order-table.tsx` — table with columns
- `apps/web/src/components/orders/order-status-badge.tsx` — colored badge

### 5.4 Product List Page

**Layout:** Inside authenticated layout

**Components:**
- Page title: "Danh sach san pham"
- Tab bar: Tat ca (156) | Binh thuong (98) | Sap het (23) | Het hang (35)
- Search bar + category filter dropdown
- Data table columns: Hinh anh (thumbnail), San pham (name+SKU), Danh muc, Gia ban, Ton kho, Trang thai
- Status badges: in_stock=green, low_stock=yellow, out_of_stock=red
- Pagination

**File:** `apps/web/src/routes/_authenticated/products/index.tsx`

**Supporting components:**
- `apps/web/src/components/products/product-table.tsx`
- `apps/web/src/components/products/product-status-badge.tsx`

## Shared Components to Create

```
apps/web/src/components/
├── shared/
│   ├── stat-card.tsx           # Dashboard stat card
│   ├── data-table-toolbar.tsx  # Search + filters + actions bar
│   ├── page-header.tsx         # Page title + breadcrumb
│   └── status-badge.tsx        # Generic colored badge
├── orders/
│   ├── order-table.tsx
│   └── order-status-badge.tsx
└── products/
    ├── product-table.tsx
    └── product-status-badge.tsx
```

## Implementation Steps

1. Create shared components (stat-card, data-table-toolbar, page-header, status-badge)
2. Implement Login page with form + auth integration
3. Implement Dashboard with stat cards + recent orders preview
4. Implement Order List with tabs, table, pagination
5. Implement Product List with tabs, table, pagination
6. Add hardcoded data files in `src/data/` for orders and products
7. Style all pages with `#2e3d95` theme
8. Test responsive behavior (basic — sidebar collapse on mobile not required for skeleton)

## Todo

- [ ] Shared components (stat-card, page-header, status-badge, data-table-toolbar)
- [ ] Login page (form + error handling)
- [ ] Dashboard page (4 stat cards + recent orders)
- [ ] Order List page (tabs + table + pagination + status badges)
- [ ] Product List page (tabs + table + pagination + status badges)
- [ ] Hardcoded data files (src/data/)
- [ ] Theme integration (#2e3d95)
- [ ] Visual review — all pages render correctly

## Success Criteria

- Login shows centered card with email/password
- Dashboard shows 4 stat cards with icons and values
- Order List shows tabbed data table with 20 orders, status badges, pagination
- Product List shows tabbed data table with 15 products, thumbnails, stock info
- All pages use `#2e3d95` primary color
- Navigation between pages works via sidebar

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| shadcn Table component complex | Slow implementation | Use basic HTML table with shadcn styling if needed |
| Too many components | File bloat | Keep components focused, max 100 lines each |
