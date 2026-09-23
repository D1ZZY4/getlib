# Overview

GetLib is a self-hosted, version-aware developer knowledge platform. The dashboard in `apps/dashboard` is a Vite plus React plus React Router single page app that lets developers explore libraries, documents, indexing jobs, and retrieval health with full provenance.

Every number and every result on screen must be traceable to a contract or to a fixture that stands in for a contract. The default data path is schema-conformant fixtures; the live Phase 3 Hono API is an opt-in switch, never a redesign.

## What's Included

- **Knowledge surfaces** - Overview, Libraries (list, add, detail, edit), Search, Indexing
- **Operations surfaces** - Analytics, Logs
- **Workspace surfaces** - Tasks, Users
- **Settings** - User, Account, Plans and Billing, Appearance, Notifications, Connections
- **Shared table primitives** - Search, filters, column visibility, pagination in `src/components/data-table/`
- **Theme system** - Real-time customizer with tweakcn and shadcn presets, persisted appearance snapshot

## Quick Start

1. **[Install](/guide/installation)** - Get running with Bun workspaces in 2 minutes
2. **[Explore Features](/guide/features)** - See what's available
3. **Start Building** - Jump into the [Vite](/vite/) guide

## Documentation

### Getting Started
- **[Installation](/guide/installation)** - Setup instructions
- **[Choosing Framework](/guide/choosing-framework)** - Data source: fixtures vs live API

### Learn More
- **[Features](/guide/features)** - What's included overview
- **[Tech Stack](/guide/tech-stack)** - Technologies used
- **[Project Structure](/guide/project-structure)** - File organization

### Framework Guides
- **[Vite Version](/vite/)** - SPA development with React Router

### Customization
- **[Components](/components/)** - UI component library
- **[Theme System](/guide/theme-system)** - Theming overview
- **[Theme Customizer](/theme-customizer/)** - Live theme editing

### Community
- **[Contributing](/guide/contributing)** - How to contribute
- **[Support](/guide/support)** - Get help
- **[License](/guide/license)** - MIT license

## Conventions

**Free and open source** - MIT licensed, use anywhere.
**Production Ready** - Clean, scalable TypeScript code.
**Modern Stack** - React 19, TypeScript, Tailwind CSS v4.
**Great DX** - Bun workspaces, Biome only (no ESLint or Prettier configs in this app), Vitest suites colocated under `tests/` folders.

---

**Ready to start?** → **[Install the template](/guide/installation)** and begin building!

_This dashboard lives at [`apps/dashboard`](https://github.com/D1ZZY4/getlib) in the GetLib monorepo._
