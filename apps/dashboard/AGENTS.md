# AGENTS.md

Scope: `apps/dashboard`

This file defines the engineering rules for the GetLib dashboard. It is an operating contract for agents working in this application.

The repository is the source of truth. This document describes how to work in the repository, not what to assume about it.

---

## 1. Mission

The dashboard is the developer-facing UI for GetLib.

Its job is to expose library knowledge, documents, chunks, indexing activity, retrieval behavior, and related operational state with clear provenance and predictable UI behavior.

The dashboard must remain:

* typed
* testable
* accessible
* modular
* version-aware
* provenance-aware
* compatible with the existing application architecture

Do not invent product behavior, API contracts, metrics, data models, or backend capabilities.

When something is not supported by the repository, schema, tests, or documented contract, treat it as unknown.

---

## 2. Stack and project boundaries

The dashboard currently uses:

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* TanStack Table
* shadcn/ui
* Tailwind CSS
* Recharts
* Zod
* Vitest
* Biome

Use the versions and configuration already declared by the repository.

Do not replace established tooling without a concrete engineering reason and explicit scope.

Do not introduce another formatter, linter, styling system, state library, data-fetching library, or UI component system for convenience.

The dashboard is a client application. Server-only secrets and infrastructure credentials must never enter `VITE_*` variables or the browser bundle.

---

## 3. Source of truth

When sources disagree, use this order of authority:

1. Executable code and configuration
2. Type definitions and schemas
3. Tests
4. Package manifests and lockfile
5. Current documentation
6. Comments and historical notes
7. Assumptions

Never reverse this order because a comment, generated note, or previous agent claim sounds convincing.

Before changing behavior:

1. Find the implementation.
2. Read the relevant surrounding code.
3. Trace its callers and consumers.
4. Inspect the associated types and schemas.
5. Inspect existing tests.
6. Reproduce the current behavior when practical.
7. Make the smallest correct change.
8. Verify the result.

Do not make architectural decisions from filenames alone.

Do not claim that a file is unused until its imports, exports, route references, dynamic imports, and tests have been checked.

---

## 4. Non-negotiable rules

### 4.1 No unsupported assumptions

Do not invent:

* API fields
* routes
* endpoints
* query parameters
* backend behavior
* database fields
* metrics
* authentication behavior
* permissions
* error codes
* loading semantics
* product requirements
* fixture meaning

A missing contract is not permission to create one.

When a contract does not exist, keep the implementation local and explicit rather than pretending the contract already exists.

### 4.2 Preserve architecture unless change is necessary

Prefer extending the existing architecture over introducing a parallel pattern.

Do not create a second implementation of something already solved elsewhere.

Do not introduce an abstraction until there is a demonstrated need for it.

Do not perform unrelated refactors while fixing a specific issue.

A change is not better because it touches more files.

### 4.3 Keep public import paths stable

When restructuring code, preserve established import paths through small barrel modules where practical.

Existing aliases such as `@/` must remain valid.

When moving files, update every affected import and test.

Do not break consumers merely to make the filesystem look cleaner.

### 4.4 One responsibility per module

Keep responsibilities separated.

Typical boundaries:

* page components orchestrate a feature
* section components render a specific concern
* table column definitions live in dedicated `*-columns.tsx` files
* drawers and inspectors live in dedicated modules
* reusable behavior belongs in hooks or shared libraries
* API access belongs in the data layer
* validation belongs at boundaries

A component that handles routing, data fetching, transformation, table configuration, dialogs, mutations, and presentation all at once is a refactoring signal.

### 4.5 File size

No `.ts` or `.tsx` file should exceed 375 lines.

The limit is a design constraint, not a formatting target.

When a file grows too large, split by responsibility rather than arbitrarily extracting tiny helpers.

Do not bypass the limit by creating meaningless wrapper files.

Verify with:

```sh
find src \( -name '*.ts' -o -name '*.tsx' \) -print0 \
  | xargs -0 wc -l \
  | awk '$1 > 375'
```

Expected result: no source file over the limit.

---

## 5. Dependency management

Use the repository's existing package manager and workspace configuration.

Do not add dependencies unless the problem cannot reasonably be solved with existing project capabilities.

Before adding or upgrading a dependency:

1. Inspect `package.json`.
2. Inspect the lockfile.
3. Check whether the repository already has an equivalent dependency.
4. Check compatibility with the current runtime and framework versions.
5. Make the smallest dependency change necessary.
6. Run the relevant verification commands.

Do not blindly use the `latest` tag.

The manifest and lockfile define the dependency state of the repository.

Dependency upgrades are intentional changes. Do not upgrade unrelated packages merely because a newer release exists.

Never replace `@getlib/*` workspace dependencies with registry versions.

---

## 6. Formatting, linting, and style

Biome is the formatter and linter for this application.

Do not add ESLint or Prettier configuration.

Follow the existing root `biome.json`.

Current project conventions include:

* 2-space indentation
* double quotes
* semicolons
* trailing commas
* organized imports

Use a targeted `biome-ignore` only when the code genuinely requires an exception.

Every ignore must explain why:

```ts
// biome-ignore <rule>: explanation of why the exception is necessary
```

Never add a bare rule suppression to silence an error without understanding it.

Do not manually fight the formatter.

Run formatting and linting through the repository's configured commands.

---

## 7. Runtime and commands

Use the commands already defined by the dashboard and workspace.

Expected dashboard commands are:

```sh
bun run --cwd apps/dashboard dev
bun run --cwd apps/dashboard build
bun run --cwd apps/dashboard typecheck
bun run --cwd apps/dashboard lint
bun run --cwd apps/dashboard lint:fix
bun run --cwd apps/dashboard test
```

Do not invent alternative commands when an existing project script already performs the task.

Before relying on a command, inspect `package.json` if there is any doubt about its implementation.

---

## 8. React architecture

Prefer simple React composition.

Pages should coordinate state and layout, not become miniature frameworks.

Avoid deep prop drilling when a clear existing context, hook, or feature boundary already exists.

Do not create global state for values that belong to a page or component.

Keep effects for external synchronization:

* subscriptions
* DOM APIs
* storage
* browser integrations
* external systems

Do not use effects to calculate values that can be derived during render.

Do not call `setState` synchronously from an effect merely to derive state from other state or props.

Prefer deriving values directly, or use the existing render-time adjustment pattern when synchronization is genuinely required.

Memoize expensive calculations when there is a demonstrated need, especially:

* large table data
* filtered datasets
* chart transformations
* expensive column definitions

Do not add `useMemo` and `useCallback` mechanically.

---

## 9. State ownership

Each category of state must have one clear owner.

Use these boundaries:

| State                            | Owner                          |
| -------------------------------- | ------------------------------ |
| Navigation                       | URL / Router                   |
| Server state                     | TanStack Query                 |
| Ephemeral UI state               | React state                    |
| Form drafts                      | Form state / local React state |
| Persisted appearance preferences | approved storage layer         |
| Global theme state               | `ThemeProvider`                |

Do not mirror the same state across multiple systems.

For example, do not copy server data from TanStack Query into a global store just to make it easier to access.

If two systems can answer the same question, one of them is probably redundant.

---

## 10. TanStack Query

TanStack Query owns remote/server state.

Use the application's configured query client and provider.

Do not create ad-hoc query clients inside feature modules.

Query keys must include every input that changes the result.

Use the established namespace:

```ts
["getlib", ...]
```

Changing query inputs must produce a different query identity.

Mutations should invalidate the smallest relevant query scope. Broad invalidation is acceptable when the data relationship genuinely requires it.

Respect the application's existing cancellation behavior.

The current operational defaults include:

* `staleTime: 10s`
* `refetchOnWindowFocus: false`

Do not change these globally for a single feature.

---

## 11. Async UI states

Every asynchronous surface must define all meaningful states.

At minimum:

1. pending
2. recoverable error
3. successful data

Also handle empty results when the domain permits them.

Do not allow failed requests to render as empty data.

Do not hide recoverable errors behind a blank component.

Error states should tell the user:

* what failed
* whether retry is possible
* what action is available next

Use the existing error abstractions rather than inventing new error handling in individual pages.

---

## 12. API and schema boundaries

`@getlib/schemas` is the authoritative API contract.

API responses must be validated at the boundary.

Do not spread unchecked API payloads through the UI.

Do not use broad `as` casts to force external data into a trusted type.

When runtime validation is required, use Zod.

`apiFetch()` is responsible for the common transport behavior already established by the application, including:

* response validation
* request ID propagation
* API error mapping
* cancellation semantics
* normalized paths

Preserve `X-Request-ID`.

An `AbortError` represents cancellation, not an application failure. Preserve its semantics and do not convert it into a user-facing error unless the product explicitly requires that behavior.

---

## 13. Data sources and fixtures

The dashboard supports fixture data and an opt-in API data source.

The default source is fixtures.

The data-source switch is configuration, not permission to create two separate architectures.

Feature hooks should expose a consistent interface regardless of the selected source.

Fixture data must be:

* deterministic
* schema-conformant
* internally consistent
* representative of the documented behavior
* free of accidental randomness

Do not modify one fixture count while leaving related fixtures inconsistent.

When a fixture represents a future backend contract, keep the fixture-specific type local until the real contract exists.

Do not prematurely extend shared schemas to support an unimplemented backend phase.

---

## 14. Provenance and knowledge data

Knowledge results are provenance-bearing data.

Where applicable, results must retain:

* library identity
* version
* source
* freshness or equivalent provenance information

Do not fabricate trust, confidence, freshness, quality, or ranking values.

If a metric or signal is not supported by an actual contract, label it as unavailable rather than inventing a plausible number.

Derived metrics must have a clear definition.

For example, a success rate must state exactly which numerator and denominator it uses and must handle zero denominators.

A visually polished lie is still a bug.

---

## 15. Shared components

Prefer existing shared components over local copies.

Important shared boundaries include:

### Tables

Reuse the existing data-table primitives for:

* table state
* search
* pagination
* column visibility
* row selection
* select-all behavior
* filters

Do not rebuild these patterns separately for individual tables.

Selection components should accept only the minimal table API they actually consume. Do not require a larger table type merely because it is convenient.

### Authentication

Use the shared authentication layout.

Authentication pages should provide their page-specific form and content without reimplementing the shared shell.

### Errors

Use the shared error page abstraction.

Error variants should remain thin wrappers when existing import paths depend on them.

### Status and trend presentation

Use the established helpers for:

* status tone mapping
* trend badges
* avatar initials

Do not copy status color classes or trend UI between pages.

### Themes and presets

Preserve existing barrel exports for theme preset modules.

Do not break historical import paths without a concrete migration reason.

---

## 16. Styling

Use Tailwind and the established shadcn/ui conventions.

Use `cn()` for conditional class composition.

Avoid duplicated raw status color classes.

Use the existing tone system for semantic states.

Use CSS variables for themeable values.

Do not hardcode brand or theme values inside individual components when an existing token exists.

Radius should come from the theme system.

For containers with rounded corners and sticky descendants, follow the established `overflow-clip` behavior where required. Do not replace it with `overflow-hidden` without verifying sticky behavior.

Do not introduce one-off styling systems for a single page.

---

## 17. Theming

`ThemeProvider` owns theme truth.

Do not create another independent dark-mode resolver.

`useThemeManager().isDarkMode` is the existing application-level resolver and should remain the source used by feature code.

Persisted appearance preferences must go through the established storage abstraction.

Storage access must tolerate environments where browser storage is unavailable.

Do not read browser globals during render unless the application architecture explicitly guards the access.

Theme previews should remain presentation-only. Do not duplicate structural containers already supplied by their parent.

Theme transitions must preserve the existing behavior for system mode and circular reveal coordinates.

---

## 18. Accessibility

Accessibility is part of correctness.

Icon-only controls require an accessible name.

Dialogs, drawers, popovers, and selects must expose usable labels.

Tests should be able to locate interactive elements by accessible name.

Loading indicators that represent asynchronous content should expose an appropriate status to assistive technology.

Use semantic table markup through the shared table primitives.

Do not replace tables with generic `div` grids when the content is tabular.

Focus behavior must be preserved when dialogs, drawers, menus, or navigation state change.

Do not solve accessibility by hiding content from assistive technology.

---

## 19. Routing and lazy loading

Route definitions live in the central route configuration.

Add routes there rather than constructing route trees inside feature pages.

Routes should remain lazy-loaded where the current application architecture expects it.

Do not duplicate route paths in sidebar configuration, command search, or feature code when a shared route definition can be used.

Before removing a route or changing its path, search for:

* imports
* links
* redirects
* navigation actions
* tests
* sidebar entries
* command search entries

---

## 20. Error handling

Errors must preserve useful diagnostic information.

Network failures should use the application's API error type.

Request IDs should remain available for debugging.

Do not silently swallow exceptions.

Do not turn a failed operation into an apparently successful empty state.

User-visible mutations should communicate their result through the application's notification mechanism where appropriate.

For example:

* successful mutation -> success feedback
* recoverable failure -> actionable error
* cancelled request -> no false failure notification

Failed jobs should expose their error state and relevant retry information when the domain supports retries.

---

## 21. Performance

Start with correctness, then measure.

Avoid unnecessary global re-renders.

Avoid repeatedly transforming large datasets during render.

Memoize expensive table and chart transformations when justified.

Prefer lazy-loaded routes for feature code.

Do not optimize trivial code prematurely.

Do not trade readability for speculative micro-optimizations.

For large tables, avoid creating unstable objects and callbacks in hot paths when profiling or existing architecture shows that they matter.

---

## 22. Testing

Vitest is the test framework.

DOM-oriented tests use jsdom through the application's established test configuration.

Shared browser shims belong in the global test setup, not repeated inside individual tests.

Use the existing test provider setup when rendering application components.

Tests should focus on observable behavior and contracts.

Prefer tests that verify:

* loading state
* error state
* retry behavior
* empty state
* successful data rendering
* navigation behavior
* accessibility
* data invariants

Avoid tests that lock the implementation to incidental details such as internal component structure or arbitrary CSS classes.

Pure utilities should remain testable without jsdom when browser APIs are not required.

Fixture tests should validate:

* schema compliance
* cross-fixture consistency
* arithmetic invariants
* domain assumptions

When changing behavior, update or add the smallest relevant test.

---

## 23. Verification

Never claim a change works without evidence.

For a normal implementation change, run at least:

```sh
bun run --cwd apps/dashboard typecheck
bun run --cwd apps/dashboard lint
bun run --cwd apps/dashboard test
```

For production-impacting changes, also run:

```sh
bun run --cwd apps/dashboard build
```

For visual changes, verify the rendered result when the available environment supports it.

When verification is incomplete, say exactly what was not verified.

Do not report:

* "tested"
* "verified"
* "working"
* "fixed"

unless the corresponding evidence exists.

---

## 24. Agent workflow

Use this workflow for every non-trivial task.

### Step 1: Locate

Identify the relevant feature, entry points, dependencies, schemas, tests, and consumers.

Do not edit immediately.

### Step 2: Read

Read enough surrounding code to understand the existing pattern.

Do not judge a file from a partial snippet.

If tool output is truncated, continue reading the missing content.

Never substitute a guessed implementation for unread code.

### Step 3: Reproduce

When fixing a bug, establish the current behavior before changing it whenever practical.

Use an existing test, a focused test, a local reproduction, or another concrete signal.

### Step 4: Change

Make the smallest change that solves the verified problem.

Preserve existing conventions.

Do not combine unrelated cleanup with the fix.

### Step 5: Verify

Run the relevant tests, typecheck, lint, build, and visual checks.

### Step 6: Report

Report only what was actually established.

Separate:

* verified facts
* implementation changes
* known limitations
* remaining uncertainty

Do not turn an inference into a fact.

---

## 25. Research and external documentation

Use external documentation only when repository evidence is insufficient or a version-sensitive behavior needs confirmation.

When consulting library documentation:

1. identify the actual installed or declared version
2. verify the library and API being discussed
3. query the narrow concept relevant to the task
4. compare the documentation with the repository's implementation
5. do not change code merely because an example uses a different version

Never silently upgrade a dependency to make an example applicable.

Do not treat external documentation as a substitute for repository conventions.

---

## 26. Refactoring rules

Refactoring is allowed when it improves correctness, maintainability, or removes demonstrated duplication.

A refactor must preserve observable behavior unless behavior change is part of the task.

Before deleting or moving code, verify all references.

When splitting a module:

* preserve public interfaces where practical
* preserve imports through barrels when needed
* move tests with the behavior they verify
* avoid creating abstraction layers without reuse
* keep each resulting module focused

Do not refactor merely because another architecture would look cleaner in isolation.

The dashboard is part of a larger system. Local elegance that breaks repository consistency is not an improvement.

---

## 27. Explicitly prohibited behavior

Do not:

* invent missing requirements
* fabricate API behavior
* fabricate metrics or fixtures
* silently change product semantics
* introduce duplicate state ownership
* create parallel architectural patterns without need
* add dependencies for convenience
* upgrade unrelated dependencies
* bypass schemas with unsafe casts
* suppress lint rules without justification
* delete code without checking references
* claim tests passed when they were not run
* claim a bug exists without evidence
* claim a bug is fixed without verification
* hide errors by rendering empty data
* leave dead props or dead exports
* add unrelated cleanup to a focused change
* exceed the source-file line limit
* introduce a second theme state
* reimplement established shared components locally
* leak server secrets into client-exposed environment variables

---

## 28. Communication standard

When working on this repository, prefer precise statements over confident-sounding guesses.

Good:

> `use-search.ts` does not include `libraryVersion` in its query key. The existing test does not cover version changes. I am adding it and verifying the affected query behavior.

Bad:

> The query cache is broken because TanStack Query is not invalidating correctly.

The second statement may sound authoritative, but without evidence it is just decorative certainty.

When evidence contradicts an earlier assumption, correct the assumption and continue from the new evidence.

Do not defend an earlier answer merely because it was already stated.

---

## 29. Final definition of done

A change is complete only when all of the following are true:

* the requested behavior is implemented
* the implementation follows the existing architecture
* no unsupported contract was invented
* affected tests pass
* typecheck passes
* lint passes
* build passes when relevant
* accessibility behavior is preserved
* no source file exceeds 375 lines
* no dead code or dead props were introduced
* public import paths remain stable where required
* touched fixtures remain internally consistent
* no client-side secret exposure was introduced
* remaining uncertainty is explicitly documented

The final response to a task must describe the actual change and actual verification performed. Nothing more.
