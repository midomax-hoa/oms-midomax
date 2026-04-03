# Brainstorm: OMS MiDoMax Management Skeleton

---
type: brainstorm
date: 2026-04-03
status: approved
---

## Problem Statement

Build skeleton management web app inspired by Shopee/Salework order management system. Login + Dashboard + Order List + Product List pages with hardcoded data. UI and data must differ from reference screenshots.

## Tech Stack

| Item | Choice |
|------|--------|
| Framework | React 19 + Vite 6 + TypeScript |
| Routing | TanStack Router (type-safe, file-based) |
| Styling | Tailwind CSS v4 + SCSS + shadcn/ui |
| Auth | Fake HTTP cookie (no backend) |
| Mono-repo | Turbo + pnpm workspaces |
| Mock API | json-server (separate package) |
| Docker | Dockerfile.dev + Dockerfile.prod |
| Node | v22 LTS |
| Deploy | Dokploy |
| Primary Color | `#2e3d95` |

## Pages

1. **Login** — Email/password form, fake cookie auth, redirect to dashboard
2. **Dashboard** — Overview cards (revenue, orders, products stats), chart placeholders
3. **Order List** — Data table with tabs, search, date filter, pagination (hardcoded)
4. **Product List** — Data table with image, SKU, price, stock columns (hardcoded)

## Layout

```
┌─────────────────────────────────────────────────┐
│  TOP NAVBAR: Logo | Search | Notifications | User│
├────────┬────────────────────────────────────────┤
│        │                                        │
│  SIDE  │         CONTENT AREA                   │
│  BAR   │                                        │
│        │  Breadcrumb                             │
│  Menu  │  ┌──────────────────────────────┐      │
│  Items │  │  Page Content                │      │
│        │  │  (Tables/Cards/Forms)        │      │
│        │  └──────────────────────────────┘      │
│        │                                        │
└────────┴────────────────────────────────────────┘
```

### Sidebar Menu

```
TONG QUAN
  - Dashboard

QUAN LY
  - Don hang        (Order List)
  - San pham        (Product List)
  - Kho hang        (placeholder)
  - Khach hang      (placeholder)

CAI DAT
  - Cua hang        (placeholder)
  - Tai khoan       (placeholder)
  - He thong        (placeholder)
```

## Mono-repo Structure

```
oms-midomax/
├── apps/
│   └── web/                    # React + Vite SPA
│       ├── src/
│       │   ├── components/
│       │   ├── layouts/
│       │   ├── pages/
│       │   ├── routes/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── styles/
│       │   └── types/
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   ├── ui/                     # Shared shadcn/ui components
│   ├── config/                 # Shared ESLint, TSConfig, Prettier
│   └── mock-api/               # json-server + db.json
├── docker/
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
├── docker-compose.yml
├── docker-compose.prod.yml
├── turbo.json
├── pnpm-workspace.yaml
├── .gitignore
├── .dockerignore
├── .env.example
├── .prettierrc
└── package.json
```

## Auth Flow

```
Login → POST /api/login (json-server)
      → Set httpOnly cookie "session=fake-token"
      → Redirect to /dashboard

Protected Routes → TanStack Router beforeLoad
                → Check cookie via /api/me
                → No cookie → /login

Logout → DELETE cookie → /login
```

## Docker Strategy

- **Dockerfile.dev**: Node 22-alpine, volume mount, pnpm dev hot reload
- **Dockerfile.prod**: Multi-stage (deps → build → nginx static SPA)
- **docker-compose.yml**: web (Vite dev:3000) + mock-api (json-server:3001)
- **docker-compose.prod.yml**: nginx + json-server override

## Key Decisions

1. React + Vite over Next.js — SPA sufficient for admin panel
2. TanStack Router — Type-safe, file-based, great Vite integration
3. shadcn/ui in shared package — Reusable across future apps
4. json-server separate package — Clean separation, easy to replace
5. Fake data differs from reference — Generic e-commerce (electronics/fashion)

## Risks

| Risk | Mitigation |
|------|------------|
| json-server limited queries | Custom middleware for filters/pagination |
| Cookie cross-origin in dev | Vite proxy to json-server |
| shadcn/ui monorepo setup | `@workspace/ui` internal package pattern |
| Tailwind v4 + SCSS coexist | SCSS for mixins only, Tailwind for utilities |

## Next Steps

Create detailed implementation plan with phases.
