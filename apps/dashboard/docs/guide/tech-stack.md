# Tech Stack

The technologies powering the GetLib dashboard.

## Core Technologies

**Frontend**
- React 19 with TypeScript (strict, `noUnusedLocals`, `noUnusedParameters`)
- Vite 8 with React Router 7 (single page app, lazy routes)
- shadcn/ui (new-york) with Radix UI primitives
- Tailwind CSS v4 for styling

**State and Data**
- TanStack Query 5 owns server state (factory client, `staleTime` 10s, no refetch on focus)
- TanStack Table v9 for data tables (shared `features` object in `src/lib/table-features.ts`)
- React Hook Form with Zod validation, `zodResolver` for forms
- localStorage owns persisted preferences (zod-validated appearance snapshot)

**Contracts and Fixtures**
- `@getlib/schemas` (workspace link) is the API boundary
- `src/fixtures/` holds the deterministic, zod-validated corpus: 12 libraries, 340 documents, 5210 chunks, 2 running jobs, 0 failed

**Charts and Icons**
- Recharts 3 for chart components
- Lucide React for icons

**Theme System**
- tweakcn and shadcn presets split into `part-*.ts` modules plus barrels
- CSS variables for theming, radius from `--radius`

## Development Tools

**Code Quality**
- Biome only (lint, format, import organization); no ESLint or Prettier configs
- TypeScript for type safety with strict settings
- Vitest suites colocated under `tests/` folders per feature

**Build and Performance**
- Lazy-loaded routes, memoized columns and chart data
- Code splitting and tree shaking via Vite

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile responsive design
- Accessibility: labeled dialogs/selects, `sr-only` icon buttons, `role="status"` skeletons, real `<table>` semantics

## Package Manager

- **Bun** 1.4+ is the package manager and runtime (Bun workspaces with `bun.lock`)
- Install with `bun install` and run scripts with `bun run --cwd apps/dashboard <script>`; npm and yarn are not officially supported

---

For exact versions, see `apps/dashboard/package.json` in the monorepo.
