# GetLib dashboard - production image baseline (Phase 1).
# Builder matches the toolchain baseline (Bun 1.4.2); runtime is pinned nginx.
FROM oven/bun:1.4.2 AS builder

WORKDIR /app
COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY apps/dashboard/package.json apps/dashboard/
COPY apps/mcp/package.json apps/mcp/
COPY packages/config/package.json packages/config/
COPY packages/database/package.json packages/database/
COPY packages/schemas/package.json packages/schemas/
COPY packages/types/package.json packages/types/
RUN bun install --frozen-lockfile --ignore-scripts
# NOTE: --ignore-scripts skips workspace lifecycle hooks. apps/mcp's
# postinstall needs its own source tree and writes a machine-unique key,
# both irrelevant to this dashboard image.

COPY apps/dashboard apps/dashboard
# @getlib/schemas resolves to TypeScript source (workspace:* link), so the
# dashboard build needs its files, not just its package.json manifest.
COPY packages/schemas packages/schemas
RUN bun run --cwd apps/dashboard build

FROM nginx:1.29-alpine AS runtime

COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/healthz || exit 1
