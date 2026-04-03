# Phase 2: Shared Packages

## Context

- [shadcn/ui Monorepo Research](../reports/researcher-260403-1232-shadcn-ui-vite-monorepo.md)
- [Turborepo Research](../reports/researcher-260403-1232-turborepo-pnpm-setup.md)
- Depends on: Phase 1

## Overview

- **Priority:** Critical
- **Status:** Complete
- **Description:** Create shared config (ESLint, TypeScript, Tailwind) and UI (shadcn/ui) packages.

## Key Insights

- Tailwind v4 uses `@tailwindcss/vite` plugin — no PostCSS needed
- shadcn/ui `components.json` paths must resolve correctly in monorepo
- ESLint flat config (eslint.config.js) is the modern standard
- TypeScript `extends` pattern for shared tsconfig

## Files to Create

### packages/config/

```
packages/config/
├── package.json
├── eslint.config.js          # Shared ESLint flat config
├── tsconfig.base.json        # Base TypeScript config
├── tsconfig.react.json       # React-specific extends base
└── tailwind.css              # Shared Tailwind CSS entry with theme
```

### packages/ui/

```
packages/ui/
├── package.json
├── tsconfig.json
├── components.json           # shadcn CLI config
├── src/
│   ├── index.ts              # Barrel re-export
│   ├── lib/
│   │   └── utils.ts          # cn() utility
│   ├── globals.css           # CSS variables (shadcn theme + #2e3d95 primary)
│   └── components/           # shadcn components added here
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       ├── dropdown-menu.tsx
│       └── separator.tsx
```

## Implementation Steps

### 2.1 Config Package

1. **Create `packages/config/package.json`**
   ```json
   {
     "name": "@workspace/config",
     "version": "0.0.1",
     "private": true,
     "type": "module",
     "exports": {
       "./eslint": "./eslint.config.js",
       "./tsconfig-base": "./tsconfig.base.json",
       "./tsconfig-react": "./tsconfig.react.json",
       "./tailwind": "./tailwind.css"
     },
     "devDependencies": {
       "eslint": "^9.0.0",
       "@eslint/js": "^9.0.0",
       "typescript-eslint": "^8.0.0",
       "eslint-plugin-react-hooks": "^5.0.0",
       "eslint-plugin-react-refresh": "^0.4.0",
       "globals": "^15.0.0"
     }
   }
   ```

2. **Create `eslint.config.js`** — ESLint flat config with React+TS rules

3. **Create `tsconfig.base.json`**
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "strict": true,
       "skipLibCheck": true,
       "esModuleInterop": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "lib": ["ES2022", "DOM", "DOM.Iterable"]
     }
   }
   ```

4. **Create `tsconfig.react.json`**
   ```json
   {
     "extends": "./tsconfig.base.json",
     "compilerOptions": {
       "jsx": "react-jsx",
       "allowImportingTsExtensions": true
     }
   }
   ```

5. **Create `tailwind.css`** — Shared entry with `@import "tailwindcss"` + CSS variables for `#2e3d95` theme

### 2.2 UI Package

6. **Create `packages/ui/package.json`**
   ```json
   {
     "name": "@workspace/ui",
     "version": "0.0.1",
     "private": true,
     "type": "module",
     "exports": {
       ".": "./src/index.ts",
       "./globals.css": "./src/globals.css"
     },
     "dependencies": {
       "class-variance-authority": "^0.7.0",
       "clsx": "^2.0.0",
       "tailwind-merge": "^2.0.0",
       "lucide-react": "^0.400.0",
       "@radix-ui/react-slot": "^1.0.0",
       "@radix-ui/react-dropdown-menu": "^2.0.0",
       "@radix-ui/react-separator": "^1.0.0",
       "@radix-ui/react-avatar": "^1.0.0"
     },
     "peerDependencies": {
       "react": "^19.0.0",
       "react-dom": "^19.0.0"
     },
     "devDependencies": {
       "@workspace/config": "workspace:*",
       "typescript": "^5.4.0"
     }
   }
   ```

7. **Create `src/lib/utils.ts`** — `cn()` helper using `clsx` + `tailwind-merge`
8. **Create `src/globals.css`** — shadcn CSS variables with `#2e3d95` as primary color
9. **Init shadcn components** — Add button, input, card, table, badge, avatar, dropdown-menu, separator
10. **Create `src/index.ts`** — Barrel exports for all components
11. **Create `components.json`** — shadcn CLI config with correct monorepo paths

### 2.3 Theme Customization

12. **Map `#2e3d95` to HSL** for shadcn CSS variables:
    - `#2e3d95` = approximately `hsl(228, 52%, 38%)`
    - Set as `--primary` in globals.css
    - Derive sidebar, accent, muted colors from same hue family

## Todo

- [ ] packages/config/package.json
- [ ] ESLint flat config
- [ ] tsconfig.base.json + tsconfig.react.json
- [ ] tailwind.css shared entry
- [ ] packages/ui/package.json
- [ ] cn() utility
- [ ] globals.css with #2e3d95 theme
- [ ] shadcn components (button, input, card, table, badge, avatar, dropdown-menu, separator)
- [ ] Barrel export index.ts
- [ ] components.json
- [ ] pnpm install & verify workspace linking

## Success Criteria

- `@workspace/config` and `@workspace/ui` resolve in consuming apps
- shadcn components render with `#2e3d95` primary color
- ESLint config importable via `@workspace/config/eslint`
- tsconfig extendable via `@workspace/config/tsconfig-react`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| shadcn CLI path resolution | Components in wrong dir | Set `components.json` paths explicitly |
| CSS variables missing | Unstyled components | Import `@workspace/ui/globals.css` in app entry |
| Tailwind content scan miss | Purged classes | Include `packages/ui/src/**/*` in content |
