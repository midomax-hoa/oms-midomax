# Phase 6: Docker & Deploy

## Context

- [Turborepo Research](../reports/researcher-260403-1232-turborepo-pnpm-setup.md) — Docker multi-stage
- [Brainstorm](../reports/brainstorm-260403-1224-oms-skeleton.md) — Docker strategy
- Depends on: Phase 1 (can run parallel with Phases 3-5)

## Overview

- **Priority:** High
- **Status:** Complete
- **Description:** Create Docker dev/prod setups, docker-compose files, Dokploy deployment config.

## Files to Create

```
docker/
├── Dockerfile.dev            # Dev: hot reload with volume mounts
├── Dockerfile.prod           # Prod: multi-stage (build → nginx)
├── nginx.conf                # Nginx config for SPA routing
docker-compose.yml            # Dev environment
docker-compose.prod.yml       # Production environment
```

## Implementation Steps

### 6.1 Dev Dockerfile

1. **Create `docker/Dockerfile.dev`**
   ```dockerfile
   FROM node:22-alpine
   
   RUN corepack enable pnpm
   WORKDIR /app
   
   COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
   COPY apps/web/package.json ./apps/web/
   COPY packages/ui/package.json ./packages/ui/
   COPY packages/config/package.json ./packages/config/
   COPY packages/mock-api/package.json ./packages/mock-api/
   
   RUN pnpm install --frozen-lockfile
   
   COPY . .
   
   EXPOSE 3000 3001
   CMD ["pnpm", "dev"]
   ```

### 6.2 Prod Dockerfile

2. **Create `docker/Dockerfile.prod`** — Multi-stage:
   - **Stage 1 (deps):** Install dependencies with frozen lockfile
   - **Stage 2 (build):** Copy source, run `turbo run build --filter=web`
   - **Stage 3 (runner):** nginx:alpine, copy `apps/web/dist/`, serve SPA

3. **Create `docker/nginx.conf`**
   ```nginx
   server {
       listen 80;
       root /usr/share/nginx/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://mock-api:3001;
           proxy_set_header Host $host;
           proxy_set_header Cookie $http_cookie;
       }
   }
   ```

### 6.3 Docker Compose

4. **Create `docker-compose.yml`** (dev)
   ```yaml
   services:
     web:
       build:
         context: .
         dockerfile: docker/Dockerfile.dev
       ports:
         - "3000:3000"
       volumes:
         - ./apps:/app/apps
         - ./packages:/app/packages
         - /app/node_modules
       environment:
         - VITE_API_URL=http://localhost:3001/api
       depends_on:
         - mock-api
     
     mock-api:
       build:
         context: .
         dockerfile: docker/Dockerfile.dev
       command: ["pnpm", "--filter", "@workspace/mock-api", "dev"]
       ports:
         - "3001:3001"
       volumes:
         - ./packages/mock-api:/app/packages/mock-api
   ```

5. **Create `docker-compose.prod.yml`**
   ```yaml
   services:
     web:
       build:
         context: .
         dockerfile: docker/Dockerfile.prod
       ports:
         - "80:80"
       depends_on:
         - mock-api
     
     mock-api:
       build:
         context: .
         dockerfile: docker/Dockerfile.dev
       command: ["pnpm", "--filter", "@workspace/mock-api", "start"]
       ports:
         - "3001:3001"
   ```

### 6.4 Deploy Config

6. **Dokploy deployment notes:**
   - Point Dokploy to git repo
   - Set build command: `docker compose -f docker-compose.prod.yml up -d`
   - Environment variables via Dokploy UI
   - Health check: `GET /` returns 200

## Todo

- [ ] docker/Dockerfile.dev
- [ ] docker/Dockerfile.prod (multi-stage)
- [ ] docker/nginx.conf (SPA routing + API proxy)
- [ ] docker-compose.yml (dev)
- [ ] docker-compose.prod.yml (prod)
- [ ] .dockerignore (verify completeness)
- [ ] Test: `docker compose up` works
- [ ] Test: `docker compose -f docker-compose.prod.yml up --build` works
- [ ] Document Dokploy deployment steps

## Success Criteria

- `docker compose up` starts web (hot reload) + mock-api
- `docker compose -f docker-compose.prod.yml up --build` builds optimized prod image
- Prod image serves SPA via nginx with `/api` proxied to mock-api
- SPA routing works (refresh on `/orders` returns index.html)
- Image size < 100MB (prod)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Volume mount permissions | Files unreadable | Use consistent UID/GID |
| pnpm lockfile out of sync | Install fails | Always use --frozen-lockfile |
| nginx SPA routing | 404 on refresh | try_files fallback to index.html |
| Dokploy compose support | Deploy fails | Test locally first, use standard compose spec |
