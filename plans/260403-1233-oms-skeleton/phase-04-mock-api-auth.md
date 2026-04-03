# Phase 4: Mock API & Auth

## Context

- [Turborepo Research](../reports/researcher-260403-1232-turborepo-pnpm-setup.md) — json-server setup
- [Brainstorm](../reports/brainstorm-260403-1224-oms-skeleton.md) — auth flow
- Depends on: Phase 3

## Overview

- **Priority:** High
- **Status:** Pending
- **Description:** Set up json-server mock API with fake data, implement cookie-based auth flow.

## Files to Create

```
packages/mock-api/
├── package.json
├── server.js                 # json-server entry with custom routes
├── db.json                   # Hardcoded fake data
├── routes.json               # URL rewrite rules
└── middleware/
    └── auth.js               # Fake auth middleware (cookie set/check)
```

**App files to modify:**

```
apps/web/src/
├── hooks/
│   └── use-auth.ts           # Auth hook (login, logout, check)
├── lib/
│   └── api.ts                # Fetch wrapper
├── routes/
│   ├── login.tsx             # Wire auth logic
│   └── _authenticated/
│       └── route.tsx         # Wire beforeLoad auth guard
```

## Implementation Steps

### 4.1 Mock API Package

1. **Create `packages/mock-api/package.json`**
   ```json
   {
     "name": "@workspace/mock-api",
     "version": "0.0.1",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "node server.js",
       "start": "node server.js"
     },
     "dependencies": {
       "json-server": "^0.17.4",
       "cookie-parser": "^1.4.6"
     }
   }
   ```

2. **Create `server.js`** — json-server with:
   - Custom `/api/login` POST route (validate hardcoded credentials, set cookie)
   - Custom `/api/logout` POST route (clear cookie)
   - Custom `/api/me` GET route (check cookie, return user)
   - Standard CRUD for `/api/orders`, `/api/products`
   - Listen on port 3001

3. **Create `db.json`** — Hardcoded data (electronics/fashion theme, NOT sports):
   - `users`: 1 admin user `{ email: "admin@midomax.com", password: "admin123" }`
   - `orders`: 20 fake orders (order ID, customer name, amount, status, date, payment method, shipping)
   - `products`: 15 fake products (SKU, name, price, stock, category, image placeholder)

4. **Create `routes.json`** — URL rewrites if needed

5. **Create `middleware/auth.js`** — Cookie-based auth middleware

### 4.2 Auth Hook & Route Protection

6. **Create `apps/web/src/hooks/use-auth.ts`**
   ```typescript
   // Functions: login(email, password), logout(), checkAuth()
   // Uses fetch to /api/login, /api/logout, /api/me
   // Returns: { user, isAuthenticated, login, logout, isLoading }
   ```

7. **Create `apps/web/src/lib/api.ts`** — Simple fetch wrapper with base URL from env

8. **Update `login.tsx`** — Wire form submit to `useAuth().login()`, redirect on success

9. **Update `_authenticated/route.tsx`** — Wire `beforeLoad` to check `/api/me`, redirect to `/login` if unauthorized

### 4.3 Root Dev Script

10. **Update root `package.json`** scripts:
    ```json
    {
      "scripts": {
        "dev": "turbo run dev",
        "dev:api": "pnpm --filter @workspace/mock-api dev"
      }
    }
    ```

11. **Update `turbo.json`** — Add mock-api dev task

## Fake Data Samples

**Orders** (Vietnamese customer names, electronics products):
```json
{
  "id": "ORD-240401-001",
  "customer": "Nguyen Van A",
  "email": "nguyenvana@email.com",
  "items": [{ "name": "Tai nghe Bluetooth XM5", "qty": 1, "price": 2450000 }],
  "total": 2450000,
  "status": "delivered",
  "paymentMethod": "Credit Card",
  "shippingProvider": "GHN Express",
  "createdAt": "2026-04-01T10:30:00Z"
}
```

**Products**:
```json
{
  "id": "PROD-001",
  "sku": "BT-XM5-BLK",
  "name": "Tai nghe Bluetooth XM5",
  "category": "Phu kien",
  "price": 2450000,
  "stock": 45,
  "status": "in_stock",
  "image": "/placeholder-product.svg"
}
```

## Todo

- [ ] packages/mock-api/package.json
- [ ] server.js with custom auth routes
- [ ] db.json with 20 orders + 15 products
- [ ] middleware/auth.js
- [ ] apps/web/src/hooks/use-auth.ts
- [ ] apps/web/src/lib/api.ts
- [ ] Wire login.tsx with auth
- [ ] Wire _authenticated/route.tsx with beforeLoad guard
- [ ] Update root scripts + turbo.json
- [ ] Test: login → dashboard → logout → redirect to login

## Success Criteria

- POST `/api/login` with correct credentials sets cookie, returns user
- POST `/api/login` with wrong credentials returns 401
- GET `/api/me` with valid cookie returns user info
- GET `/api/me` without cookie returns 401
- Protected routes redirect to `/login` when unauthenticated
- Login form redirects to `/` (dashboard) on success
- GET `/api/orders` returns paginated order data
- GET `/api/products` returns product data

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| json-server cookie handling | Auth breaks | Custom middleware, cookie-parser |
| Vite proxy cookie forwarding | Cookie not set | Ensure proxy passes cookies |
| json-server v1 vs v0.17 API | Different API | Pin to 0.17.x (stable, well-documented) |
