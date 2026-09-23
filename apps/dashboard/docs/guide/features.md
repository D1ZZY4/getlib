# Features

A comprehensive overview of what's included in the GetLib dashboard.

## Knowledge Surfaces

**Overview**
- Service health with uptime, library/document/chunk counts, active and failed jobs
- Indexing activity chart and recently indexed documents
- Loading skeletons, recoverable errors with retry, and empty states

**Libraries**
- Registered libraries with ecosystem, version, sources, indexing state, freshness
- Add, edit, and detail pages with versions table and reindex actions
- Filter by indexing state, global search, CSV export

**Search**
- Query form with library, version, source, and limit filters
- Library results with trust signals derived from indexing state
- Knowledge results with library, version, source, and freshness provenance

**Indexing**
- Job queue covering queued, running, retrying, completed, failed, canceled
- Board and table views with retry, cancel, inspect, and CSV export

## Operations Surfaces

**Analytics**
- Search activity (searches vs with-results), knowledge by source, recent jobs, top libraries, retrieval insights
- Success rate guarded against zero (`withResults / searches`, fallback `"-"`)

**Logs**
- System log stream across api, worker, ingestion, mcp, and database services
- Level and service filters, inspector drawer, add dialog, CSV export

## Workspace Surfaces

**Tasks and Users**
- Task tracker with filters and CSV-friendly tables
- Users table with role, plan, and status filters plus add/edit dialogs

## Component Library

**Built on shadcn/ui**
- All primitives in `src/components/ui/` with data-slot semantics
- Shared table primitives in `src/components/data-table/` (never reimplemented per table)
- Chart components with Recharts integration

**Theme System**
- Real-time customizer with tweakcn and shadcn presets
- Appearance snapshot persisted in localStorage, zod-validated
- Layout variations (sidebar/floating/inset, left/right, collapsible modes)

## Developer Features

**Modern Stack**
- React 19, strict TypeScript, Tailwind CSS v4
- Biome-only tooling, Vitest suites colocated per feature

**Performance**
- Lazy-loaded routes, memoized columns and chart data
- Query defaults tuned for ops screens (`staleTime` 10s, no refetch on focus)

---

For detailed component documentation, see [Components](/components/).
For theming details, see [Theme Customizer](/theme-customizer/).
