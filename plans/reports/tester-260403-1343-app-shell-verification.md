# App Shell & Routing Verification Report

**Date:** 2026-04-03 | **Branch:** master

## Test Results

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | `pnpm install` | PASS | Lockfile up to date, 533ms |
| 2 | `pnpm --filter web type-check` | PASS | No TS errors |
| 3 | `pnpm --filter web build` | PASS | Built in 1.56s |
| 4 | Code-split route chunks | PASS | 6 separate JS chunks in dist/ |
| 5 | `pnpm --filter web lint` | PASS | Clean, no warnings |
| 6 | Route files exist | PASS | All 6 route files present |
| 7 | Component files exist | PASS | All 4 component files present |
| 8 | `lib/constants.ts` menuItems | PASS | 3 groups: Tong Quan, Quan Ly, Cai Dat |

## Route Files Verified

- `apps/web/src/routes/__root.tsx`
- `apps/web/src/routes/login.tsx`
- `apps/web/src/routes/_authenticated/route.tsx`
- `apps/web/src/routes/_authenticated/index.tsx`
- `apps/web/src/routes/_authenticated/orders/index.tsx`
- `apps/web/src/routes/_authenticated/products/index.tsx`

## Component Files Verified

- `apps/web/src/components/layout/top-navbar.tsx`
- `apps/web/src/components/layout/sidebar.tsx`
- `apps/web/src/components/layout/breadcrumb.tsx`
- `apps/web/src/components/shared/loading-spinner.tsx`

## Build Output (Code Splitting)

```
dist/assets/index-1wAn8_9T.css       13.24 kB
dist/assets/index-Ndwvb84M.js         0.28 kB  (route chunk)
dist/assets/index--4QCDfnt.js          0.28 kB  (route chunk)
dist/assets/index-d5ynpBwO.js         0.43 kB  (route chunk)
dist/assets/login-CVFFKc8O.js         1.05 kB  (login route)
dist/assets/separator-BhArozZU.js   113.13 kB  (ui lib)
dist/assets/index-C-7g0Q7G.js       288.63 kB  (app core)
dist/assets/route-CqsuaRbr.js       652.17 kB  (auth layout)
```

## Warnings

- **Chunk size warning:** `route-CqsuaRbr.js` is 652 kB (>500 kB limit). This is the authenticated layout chunk bundling shadcn/ui components. Consider `manualChunks` in Vite config to split vendor libs separately. Non-blocking for now.

## Menu Groups (constants.ts)

- **Tong Quan:** Dashboard
- **Quan Ly:** Don hang, San pham, Kho hang (disabled), Khach hang (disabled)
- **Cai Dat:** Cua hang (disabled), Tai khoan (disabled), He thong (disabled)

## Overall Verdict: ALL PASS

All 8 checks passed. App shell builds, type-checks, and lints cleanly. Routes are code-split. Only non-blocking note is the large chunk size warning.
