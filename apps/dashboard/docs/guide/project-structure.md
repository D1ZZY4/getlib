# Project Structure

File organization for `apps/dashboard` in the GetLib monorepo.

## Monorepo Layout

```text
getlib/
├── apps/dashboard/         # This Vite + React dashboard (GetLib knowledge UI)
├── apps/mcp/               # MCP surface
├── packages/               # Shared config, database, schemas, types
└── docs/                   # (Template docs live under apps/dashboard/docs)
```

## Dashboard Directory Structure

```text
apps/dashboard/src/
├── main.tsx               # Entry point, mounts App
├── App.tsx                # Provider order: Theme, SidebarConfig, Query, Router
├── config/routes.tsx      # Lazy route table (single place for paths)
├── app/                   # Feature pages by domain
│   ├── overview/          # GetLib overview (health, activity, recents)
│   ├── analytics/         # Search/indexing analytics
│   ├── libraries/         # List, add, detail, edit + components/
│   ├── search/            # Query form, library + knowledge results
│   ├── indexing/          # Job board, table, inspector
│   ├── logs/              # Log stream table + inspector
│   ├── tasks/             # Task tracker
│   ├── users/             # Users table
│   ├── auth/              # Sign in/up, forgot password
│   ├── errors/            # 401/403/404/500/maintenance
│   └── settings/          # user, account, billing, appearance, notifications, connections
├── components/            # data-table primitives, layouts, theme-customizer, ui/
├── hooks/                 # Server state (use-overview, use-search) + UI hooks
├── lib/                   # api-client, data-source, query-client, appearance, download, format
├── fixtures/              # Zod-validated corpus + per-module tests
├── contexts/              # theme-context, sidebar-context, sidebar-state
├── types/                 # theme + theme-customizer types
├── utils/                 # analytics, tweakcn/shadcn preset parts
└── config/                # routes, theme-data, theme-customizer-constants
```

## Key Conventions

**File Naming**
- `page.tsx` - Route endpoints, one per route
- `components/*.tsx` - Section components (never loose next to `page.tsx`)
- `tests/*.test.tsx` - Every test lives in a `tests/` subfolder of its feature
- `*-columns.tsx` - Table column definitions
- `PascalCase.tsx` - Component files
- `kebab-case.ts` - Utility files

**Import Aliases**
- `@/components` - UI components
- `@/lib` - Utilities and configs
- `@/hooks` - Custom hooks

**Settings Convention**
`page.tsx` plus `components/*.tsx` (plus `data/*.json` when needed), as in `settings/billing`.

## Data Organization

Fixture data is co-located with features (`src/fixtures/`, plus `data/*.json` beside pages that need them). Every fixture parses against `@getlib/schemas` (or local zod) at load time so drift fails fast in tests.

---

For framework-specific details, see the [Vite](/vite/) guide.
