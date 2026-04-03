# Phase 3: App Shell & Routing

## Context

- [TanStack Router Research](../reports/researcher-260403-1232-tanstack-router-setup.md)
- Depends on: Phase 2

## Overview

- **Priority:** Critical
- **Status:** Pending
- **Description:** Create React+Vite app with TanStack Router, layout shell (top navbar + sidebar), and route structure.

## Key Insights

- TanStack Router v1.x: `@tanstack/router-plugin/vite` for file-based routing
- `__root.tsx` = root layout, `route.tsx` = nested layout, `index.tsx` = page
- `beforeLoad` for route protection (Phase 4 wires auth)
- `<Outlet />` renders child routes

## Files to Create

```
apps/web/
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── index.html
├── eslint.config.js
├── src/
│   ├── main.tsx                    # App entry
│   ├── index.css                   # Import tailwind + globals
│   ├── routes/
│   │   ├── __root.tsx              # Root layout (minimal, just <Outlet />)
│   │   ├── login.tsx               # Login page route
│   │   ├── _authenticated/
│   │   │   ├── route.tsx           # Auth guard layout (navbar + sidebar + <Outlet />)
│   │   │   ├── index.tsx           # Dashboard (/)
│   │   │   ├── orders/
│   │   │   │   └── index.tsx       # Order list
│   │   │   └── products/
│   │   │       └── index.tsx       # Product list
│   ├── components/
│   │   ├── layout/
│   │   │   ├── top-navbar.tsx      # Top navigation bar
│   │   │   ├── sidebar.tsx         # Left sidebar navigation
│   │   │   └── breadcrumb.tsx      # Breadcrumb component
│   │   └── shared/
│   │       └── loading-spinner.tsx
│   ├── lib/
│   │   └── constants.ts           # App constants, menu items
│   ├── types/
│   │   └── index.ts               # Shared types
│   └── styles/
│       └── layout.scss            # Complex layout SCSS if needed
```

## Implementation Steps

1. **Create `apps/web/package.json`**
   ```json
   {
     "name": "web",
     "version": "0.0.1",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "tsc -b && vite build",
       "lint": "eslint .",
       "type-check": "tsc --noEmit",
       "preview": "vite preview"
     },
     "dependencies": {
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "@tanstack/react-router": "^1.0.0",
       "@workspace/ui": "workspace:*"
     },
     "devDependencies": {
       "@tanstack/router-plugin": "^1.0.0",
       "@tailwindcss/vite": "^4.0.0",
       "@vitejs/plugin-react": "^4.0.0",
       "@workspace/config": "workspace:*",
       "sass-embedded": "^1.0.0",
       "tailwindcss": "^4.0.0",
       "typescript": "^5.4.0",
       "vite": "^6.0.0"
     }
   }
   ```

2. **Create `vite.config.ts`**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'
   import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
   import path from 'path'

   export default defineConfig({
     plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react(), tailwindcss()],
     resolve: { alias: { '@': path.resolve(__dirname, './src') } },
     server: {
       port: 3000,
       proxy: { '/api': 'http://localhost:3001' },
     },
   })
   ```

3. **Create `index.html`** — Standard Vite entry pointing to `src/main.tsx`

4. **Create `src/main.tsx`** — RouterProvider setup with TanStack Router

5. **Create `src/index.css`**
   ```css
   @import "tailwindcss";
   @import "@workspace/ui/globals.css";
   ```

6. **Create `src/routes/__root.tsx`** — Root layout with `<Outlet />`

7. **Create `src/routes/_authenticated/route.tsx`** — Layout with top navbar + sidebar + `<Outlet />`. Uses `beforeLoad` guard (stub — wired in Phase 4).

8. **Create `src/routes/login.tsx`** — Login page (UI only — auth logic in Phase 4)

9. **Create `src/routes/_authenticated/index.tsx`** — Dashboard placeholder

10. **Create `src/routes/_authenticated/orders/index.tsx`** — Orders placeholder

11. **Create `src/routes/_authenticated/products/index.tsx`** — Products placeholder

12. **Create layout components** — top-navbar, sidebar, breadcrumb

13. **Create `src/lib/constants.ts`** — Menu items array for sidebar

14. **Create `tsconfig.json`** + `tsconfig.app.json` extending `@workspace/config/tsconfig-react`

15. **Create `eslint.config.js`** importing from `@workspace/config/eslint`

## Sidebar Menu Config

```typescript
export const menuItems = [
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
```

## Todo

- [ ] apps/web/package.json
- [ ] vite.config.ts (React + Tailwind + TanStack Router + proxy)
- [ ] index.html
- [ ] src/main.tsx (RouterProvider)
- [ ] src/index.css (Tailwind + globals import)
- [ ] tsconfig.json + tsconfig.app.json
- [ ] eslint.config.js
- [ ] __root.tsx (root layout)
- [ ] _authenticated/route.tsx (navbar+sidebar layout)
- [ ] login.tsx (UI placeholder)
- [ ] Dashboard/Orders/Products index.tsx (placeholders)
- [ ] top-navbar.tsx
- [ ] sidebar.tsx
- [ ] breadcrumb.tsx
- [ ] constants.ts (menu items)
- [ ] pnpm install & verify `pnpm dev` starts

## Success Criteria

- `pnpm dev` starts Vite dev server on :3000
- Navigation between pages works
- Sidebar highlights active route
- Layout renders: top navbar + sidebar + content area
- Route code-splitting works (lazy loaded)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| TanStack Router version mismatch | Routes fail | Pin version, check docs |
| `_authenticated` prefix convention | Wrong layout | Verify TanStack pathless layout pattern |
| Vite proxy not working | API calls fail | Test proxy config, fallback to env var |
