# TanStack Router Setup Research Report
**Date:** 2026-04-03 | **Status:** COMPLETE

## Executive Summary
TanStack Router v1.x (stable, mature ecosystem) integrates with Vite via `@tanstack/router-plugin` for file-based routing. Implements route protection via `beforeLoad` guards and layout routes through file structure conventions.

---

## 1. Latest Stable Version & Installation

**Current Stable:** v1.x (as of Feb 2025)

```bash
npm install @tanstack/react-router @tanstack/router-plugin
# TypeScript support included; no separate @types needed
```

**Vite Config Integration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
  ],
})
```

---

## 2. File-Based Routing Structure

**Convention:** Routes auto-generated from `src/routes/` directory structure.

```
src/routes/
├── __root.tsx          # Root layout component
├── index.tsx           # Home page (/)
├── about.tsx           # About page (/about)
├── dashboard/
│   ├── route.tsx       # Dashboard layout (/dashboard)
│   ├── index.tsx       # Dashboard home (/dashboard)
│   ├── settings/
│   │   └── route.tsx   # Settings page (/dashboard/settings)
└── blog/
    ├── route.tsx       # Blog layout (/blog)
    └── $postId.tsx     # Dynamic route (/blog/:postId)
```

**Key:** `route.tsx` = layout; `index.tsx` = page; `$param` = dynamic segment.

---

## 3. Route Protection (beforeLoad Guard)

```typescript
// src/routes/dashboard/route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { authStore } from '@/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const isAuth = authStore.isAuthenticated()
    
    if (!isAuth) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    
    return { user: authStore.getUser() }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()
  return <div>Welcome {user.name}</div>
}
```

**Pattern:** `beforeLoad` runs before route renders; throw `redirect()` to protect; `useRouteContext()` accesses returned data.

---

## 4. Layout Routes (Shared Layouts)

```typescript
// src/routes/__root.tsx
import { RootRoute, Outlet } from '@tanstack/react-router'

export const rootRoute = new RootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}

// src/routes/dashboard/route.tsx
export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Nested route children */}
    </div>
  )
}
```

**Pattern:** `<Outlet />` renders child routes. Layout files define shared UI for subtrees.

---

## 5. @tanstack/router-plugin Features

**Automatic File Scanning:**
- Watches `src/routes/` directory
- Generates route tree at build time
- Supports lazy code-splitting per route
- Type-safe route params/search inference

**Config Options:**
```typescript
TanStackRouterVite({
  autoCodeSplitting: true,        // Lazy load route components
  generatedRouteTree: 'src/routeTree.gen.ts', // Output file
})
```

---

## Practical Setup Checklist

- [x] Install `@tanstack/react-router` + `@tanstack/router-plugin`
- [x] Add Vite plugin to `vite.config.ts`
- [x] Create `src/routes/__root.tsx` (root layout)
- [x] Implement `beforeLoad` guards for protected routes
- [x] Use `<Outlet />` in layout components
- [x] Access route context via `Route.useRouteContext()`

---

## Trade-offs & Adoption Risk

| Aspect | Status | Notes |
|--------|--------|-------|
| **Maturity** | Stable | v1.x production-ready; established community |
| **Learning Curve** | Medium | File-based routing familiar; `beforeLoad` API clear |
| **Type Safety** | Excellent | Full TS support; inferred params/search |
| **Breaking Changes** | Low | v1.x stable; v2 upcoming but not breaking current |

---

## Unresolved Questions

1. Current v1.x version number (Feb 2025 cutoff; verify latest release tag)
2. v2 roadmap timeline and breaking changes (if applicable)
3. Interaction with suspense boundaries in `beforeLoad` for async auth checks
