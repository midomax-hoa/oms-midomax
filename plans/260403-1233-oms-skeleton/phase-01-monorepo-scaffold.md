# Phase 1: Monorepo Scaffold

## Context

- [Turborepo + pnpm Research](../reports/researcher-260403-1232-turborepo-pnpm-setup.md)
- [Brainstorm](../reports/brainstorm-260403-1224-oms-skeleton.md)

## Overview

- **Priority:** Critical
- **Status:** Pending
- **Description:** Initialize Turbo + pnpm monorepo with root configs, workspace structure, and dotfiles.

## Key Insights

- Turbo 2.x: simplified config, sensible defaults
- pnpm 9.x: `workspace:*` protocol for internal packages
- `packageManager` field in root package.json enforces pnpm version
- Node 22 LTS for all environments

## Files to Create

```
oms-midomax/
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # Workspace packages definition
├── turbo.json                # Task pipeline config
├── .gitignore
├── .dockerignore
├── .env.example
├── .prettierrc
├── .nvmrc                    # Node version pinning
├── apps/
│   └── web/                  # (empty, created in phase 3)
├── packages/
│   ├── ui/                   # (setup in phase 2)
│   ├── config/               # (setup in phase 2)
│   └── mock-api/             # (setup in phase 4)
└── docker/                   # (setup in phase 6)
```

## Implementation Steps

1. **Initialize git repo**
   ```bash
   cd /home/harris/Projects/oms-midomax
   git init
   ```

2. **Create root `package.json`**
   ```json
   {
     "name": "oms-midomax",
     "private": true,
     "packageManager": "pnpm@9.15.0",
     "scripts": {
       "build": "turbo run build",
       "dev": "turbo run dev",
       "lint": "turbo run lint",
       "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,scss,md}\"",
       "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,scss,md}\"",
       "type-check": "turbo run type-check"
     },
     "devDependencies": {
       "turbo": "^2.0.0",
       "prettier": "^3.0.0"
     }
   }
   ```

3. **Create `pnpm-workspace.yaml`**
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

4. **Create `turbo.json`**
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "tasks": {
       "build": {
         "outputs": ["dist/**"],
         "dependsOn": ["^build"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       },
       "lint": {
         "outputs": [".eslintcache"],
         "cache": true
       },
       "type-check": {
         "cache": true
       }
     }
   }
   ```

5. **Create `.gitignore`** — Node/React/Turbo patterns
6. **Create `.dockerignore`** — node_modules, .git, dist, .turbo
7. **Create `.env.example`**
   ```env
   VITE_API_URL=http://localhost:3001/api
   NODE_ENV=development
   ```
8. **Create `.prettierrc`**
   ```json
   {
     "semi": false,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "all",
     "printWidth": 100
   }
   ```
9. **Create `.nvmrc`** — `22`
10. **Create directory structure** — `apps/`, `packages/ui/`, `packages/config/`, `packages/mock-api/`, `docker/`
11. **Run `pnpm install`** to generate lockfile

## Todo

- [ ] git init
- [ ] Root package.json
- [ ] pnpm-workspace.yaml
- [ ] turbo.json
- [ ] .gitignore
- [ ] .dockerignore
- [ ] .env.example
- [ ] .prettierrc
- [ ] .nvmrc
- [ ] Directory structure with .gitkeep
- [ ] pnpm install
- [ ] Verify `pnpm turbo --version` works

## Success Criteria

- `pnpm install` completes without errors
- `turbo --version` outputs 2.x
- All dotfiles in place
- Workspace packages recognized by pnpm

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| pnpm version mismatch | Build fails | Pin via `packageManager` field |
| Turbo config wrong | Tasks don't run | Use minimal config, add incrementally |
