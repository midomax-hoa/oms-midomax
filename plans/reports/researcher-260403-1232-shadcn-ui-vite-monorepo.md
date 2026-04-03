# shadcn/ui + Vite + Monorepo Setup Research Report
**Date:** 2026-04-03 | **Status:** COMPLETE

## Executive Summary

shadcn/ui (v1.x, stable) works with Vite but requires manual setup (no Vite template). In a Turbo + pnpm monorepo, create a shared `packages/ui` package with shadcn components re-exported. Tailwind v4 uses `@tailwindcss/vite` plugin. Key gotcha: `components.json` paths must resolve aliases in monorepo context.

---

## 1. Latest shadcn/ui Setup for Vite

**Current Version:** v1.x (stable, no breaking changes planned for v2 as of Feb 2025)

**Core Dependencies:**
```bash
pnpm add -w react react-dom class-variance-authority clsx tailwind-merge
pnpm add -D typescript @types/react @types/react-dom
```

**No official Vite template exists.** Start with Vite React template, then manually init shadcn:

```bash
# In app directory (e.g., apps/web)
pnpm exec shadcn-ui@latest init
```

**Init Prompts (customize for monorepo):**
- TypeScript: Yes
- Style: New York (or Default)
- CSS Variables: Yes (required for theme system)
- Base color: Slate
- Config location: `./` (or relative to app root)

**Output:** Creates `components.json`, `tsconfig.json` updates, CSS imports.

---

## 2. Shared UI Package in Monorepo

**Structure:**
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts           # cn() utility from shadcn init
│   ├── globals.css
│   └── index.ts               # Re-exports
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── components.json            # shadcn CLI config
```

**package.json (packages/ui):**
```json
{
  "name": "@mono/ui",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./styles": "./src/globals.css"
  },
  "devDependencies": {
    "@shadcn/ui": "latest",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x"
  }
}
```

**src/index.ts (re-export barrel):**
```typescript
export * from './components/button'
export * from './components/card'
// ... all components
export { cn } from './lib/utils'
```

**Key:** Use `exports` field with `types` first (TypeScript resolution).

---

## 3. Tailwind CSS v4 Monorepo Configuration

**Root tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './apps/*/src/**/*.{ts,tsx}',
    './packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

**packages/ui/tailwind.config.ts (inherits root):**
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('../../tailwind.config.ts')],
} satisfies Config
```

**Vite Config (apps/web/vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

**CSS Entry (src/index.css):**
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    /* ... theme variables from shadcn init */
  }
}
```

**No separate `tailwind.css` needed with v4 `@tailwindcss/vite` plugin.**

---

## 4. components.json for Monorepo

**packages/ui/components.json:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "baseColor": "slate",
  "aliases": {
    "@/*": "./src/*",
    "@/components": "./src/components",
    "@/lib": "./src/lib"
  },
  "paths": {
    "utils": "./src/lib/utils.ts",
    "components": "./src/components"
  }
}
```

**In consuming apps (apps/web/components.json):**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "baseColor": "slate",
  "aliases": {
    "@/*": "./src/*",
    "@/components": "./src/components",
    "@/lib": "./src/lib",
    "@ui/*": "../../packages/ui/src/*"
  },
  "paths": {
    "utils": "../../packages/ui/src/lib/utils.ts",
    "components": "../../packages/ui/src/components"
  }
}
```

**Key:** `paths.utils` must point to shared package; `paths.components` can be local or shared.

---

## 5. Known Gotchas & Mitigation

| Gotcha | Symptom | Fix |
|--------|---------|-----|
| **Path alias resolution** | `@/` resolves wrongly in monorepo | Absolute paths in `components.json`, check tsconfig extends chain |
| **Tailwind content scan miss** | Unused classes purged from shared UI | Add `packages/ui/src/**/*` to root content array |
| **CSS duplicate in bundles** | Tailwind CSS included twice per app | Deduplicate via Vite `external` or move to root build step |
| **Init in wrong directory** | shadcn CLI creates config in wrong place | Always run `shadcn init` from target package root |
| **Missing CSS variables** | Components unstyled (no theme colors) | Ensure `globals.css` with `:root {}` imported in all apps |

**Recommended Setup Order:**
1. Create `packages/ui` with `package.json` + `tsconfig.json`
2. Run `pnpm install` (link workspace)
3. In `packages/ui`, run `shadcn init` (generates config locally)
4. Move generated CSS to `src/globals.css`
5. Configure root `tailwind.config.ts` with workspace globs
6. In consuming apps, update `components.json` `paths` to point to `packages/ui`

---

## Trade-offs & Adoption Risk

| Dimension | Assessment | Notes |
|-----------|------------|-------|
| **Maturity** | Production-ready | shadcn stable; Vite mature; pnpm monorepos proven |
| **Setup Complexity** | Medium | Manual steps; no integrated template reduces friction |
| **Maintenance** | Low | Shadcn deps minimal; Tailwind v4 stable |
| **Type Safety** | Excellent | Full TS inference across workspace |
| **Breaking Changes** | Low | v1.x stable; v2 not committed for release |
| **Community** | Large | Extensive guides for Vite; monorepo patterns well-documented |

---

## Recommendation

**Use shadcn/ui in Turbo + pnpm for this project:**
- Vite integration via `@tailwindcss/vite` is production-proven (no overhead)
- Shared UI package pattern standard in industry (Nx, Turbo examples exist)
- Tailwind v4 eliminates PostCSS complexity
- Risk low due to stability of all dependencies

**Do NOT use if:** Team has zero Tailwind experience + strict deadline (learning curve 2-3 days).

---

## Unresolved Questions

1. **Exact v1.x version**: Confirm latest release tag (cutoff Feb 2025; check GitHub releases)
2. **CLI monorepo detection**: Does `shadcn init` auto-detect monorepo root or require manual path?
3. **CSS-in-JS alternative**: Can Tailwind `@apply` be replaced with Panda/UnoCSS in this setup?
4. **Prebuilt component bundles**: Any performance advantage to bundling UI package separately (e.g., as ESM only)?
