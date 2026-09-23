# Installation

Get the GetLib dashboard running in under 2 minutes from the monorepo root.

## Prerequisites

- Bun 1.4+ (required, this repo uses Bun workspaces with `bun.lock`)
- Git for cloning

## Quick Setup

```bash
git clone https://github.com/D1ZZY4/getlib.git
cd getlib
bun install
bun run --cwd apps/dashboard dev
```

Open `http://localhost:5173`

## Commands

All commands run from the workspace root with Bun:

**Development:**
```bash
bun run --cwd apps/dashboard dev          # Vite dev server
bun run --cwd apps/dashboard build        # tsc -b then vite build
bun run --cwd apps/dashboard preview      # Preview build
```

**Code Quality:**
```bash
bun run --cwd apps/dashboard lint         # biome check . (must exit 0)
bun run --cwd apps/dashboard lint:fix     # biome check --write .
bun run --cwd apps/dashboard typecheck    # tsc -b
bun run --cwd apps/dashboard test         # vitest run
```

Tooling is Biome only, always tracking the latest release. There are no ESLint or Prettier configs in this app. Dashboard CSS is excluded from Biome by a scoped override because its parser does not cover Tailwind at rules.

## Environment

Copy the example env file to configure the client:

```bash
cp apps/dashboard/.env.example apps/dashboard/.env
```

Key variables (all `VITE_*` so Vite exposes them to the browser):

- `VITE_API_BASE_URL` (default `http://localhost:3001/api/v1`)
- `VITE_DATA_SOURCE` (`fixture` default, `api` opt-in for the live Phase 3 API)
- `VITE_BASENAME` (subdirectory deployments)
- `VITE_GTM_ID` (optional analytics)

Never put server secrets such as `DATABASE_URL` into `VITE_*` variables because those ship to the browser bundle.

## Troubleshooting

**Common Issues:**

- **Port in use**: Use `bun run --cwd apps/dashboard dev --port 5174`
- **TypeScript errors**: Run `bun install` and restart your editor

**Need help?** Check the [support guide](/guide/support).

## Next Steps

- **[Explore Features](/guide/features)** - See what's included
- **[Framework Guide](/vite/)** - Dive into the Vite guide
