---
name: OMS MiDoMax Management Skeleton
status: pending
created: 2026-04-03
phases: 6
blockedBy: []
blocks: []
---

# OMS MiDoMax Management Skeleton

## Overview

Build skeleton management web app (React+Vite SPA) with Login, Dashboard, Order List, Product List pages. Hardcoded fake data. Mono-repo with Turbo+pnpm. Docker for dev+prod. Deploy via Dokploy.

**Primary Color:** `#2e3d95`

## Research Reports

- [TanStack Router Setup](../reports/researcher-260403-1232-tanstack-router-setup.md)
- [shadcn/ui Monorepo Setup](../reports/researcher-260403-1232-shadcn-ui-vite-monorepo.md)
- [Turborepo + pnpm Setup](../reports/researcher-260403-1232-turborepo-pnpm-setup.md)
- [Brainstorm Report](../reports/brainstorm-260403-1224-oms-skeleton.md)

## Tech Stack

| Item | Version | Notes |
|------|---------|-------|
| React | 19 | SPA, no SSR |
| Vite | 6 | Build tool |
| TypeScript | 5.x | Strict mode |
| TanStack Router | 1.x | File-based, type-safe |
| Tailwind CSS | 4.x | `@tailwindcss/vite` plugin |
| SCSS | latest | Complex mixins only |
| shadcn/ui | latest | New York style |
| Turbo | 2.x | Task runner |
| pnpm | 9.x | Package manager |
| json-server | 0.17.x | Mock API |
| Node | 22 LTS | Runtime |
| Docker | latest | Dev + Prod |

## Phases

| # | Phase | Status | Priority | Effort |
|---|-------|--------|----------|--------|
| 1 | [Monorepo Scaffold](phase-01-monorepo-scaffold.md) | pending | critical | medium |
| 2 | [Shared Packages](phase-02-shared-packages.md) | pending | critical | medium |
| 3 | [App Shell & Routing](phase-03-app-shell-routing.md) | pending | critical | medium |
| 4 | [Mock API & Auth](phase-04-mock-api-auth.md) | pending | high | small |
| 5 | [Pages Implementation](phase-05-pages-implementation.md) | pending | high | large |
| 6 | [Docker & Deploy](phase-06-docker-deploy.md) | pending | high | medium |

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
Phase 1 → Phase 6 (can parallel with 3-5)
```

## Success Criteria

- [ ] `pnpm dev` starts web app + mock API
- [ ] Login page authenticates with fake cookie
- [ ] Dashboard shows stats cards
- [ ] Order List shows paginated hardcoded data table
- [ ] Product List shows hardcoded data table with images
- [ ] `docker compose up` works for dev
- [ ] `docker compose -f docker-compose.prod.yml up` works for prod
- [ ] ESLint + Prettier configured and passing
