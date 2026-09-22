# GetLib docs

Planning source of truth: Linear project **GetLib** (`P-ENG1-3`).

- Phase 0 (Project Setup & Blueprint): complete in Linear.
- Phase 1 (Foundation): this repository baseline.
  - `turbo.json` - task orchestration
  - `biome.json` - lint/format
  - `tsconfig.base.json` - strict TypeScript baseline
  - `compose.yml` - local PostgreSQL + pgvector
  - `packages/schemas` - shared Zod contracts
  - `packages/config` - validated runtime configuration
  - `packages/types` - small shared types

Architecture overview: `AI Agents -> MCP`, `Dashboard -> API`, `CLI -> API/Core`,
`MCP/API -> Core`, `Core -> Registry / Search / Ingestion`,
`Worker -> Ingestion`, all persisted in PostgreSQL + pgvector.

See Linear documents `02 - Architecture Blueprint`, `03 - Full Repository Structure`,
`04 - Technology Stack & Decisions`, `10 - Roadmap`, `14 - ADRs & Open Decisions`.
