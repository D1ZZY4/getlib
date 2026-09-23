# Choosing Data Source: Fixtures vs Live API

This guide helps you decide between the default fixture corpus and the live Phase 3 Hono API.

## Source Comparison

| Feature | Fixture (default) | Live API (opt-in) |
|---------|------------------|-------------------|
| **Setup** | Zero backend required | Phase 3 Hono API running |
| **Switch** | `VITE_DATA_SOURCE` unset or `fixture` | `VITE_DATA_SOURCE=api` |
| **Validation** | Zod at module load, drift fails fast in tests | `apiFetch` validates every response against `@getlib/schemas` |
| **Search** | Async cancelable matcher with `AbortSignal` semantics | Live retrieval (Phase 6); currently throws a not-implemented error |
| **Writes** | Local page state only | Real mutations with toast confirmations |

## When to Choose Fixtures

### Perfect for:

- **Frontend development without a backend**
- **Deterministic tests** (12 libraries, 340 documents, 5210 chunks, 2 running, 0 failed)
- **Demos and reviews**

### Fixture Discipline:

- Deterministic data only (no `Math.random` in fixtures)
- Cross-file counts stay consistent; tests assert the totals
- Fixture-only shapes stay local until their owning backend phase lands

## When to Choose the Live API

### Perfect for:

- **End-to-end verification against real services**
- **Contract testing** (`INVALID_RESPONSE` errors surface drift immediately)

### Live API Behavior:

- Every request carries `X-Request-ID` for trace correlation
- `AbortError` is rethrown unchanged, never reported as failure
- Error envelopes map to `GetLibApiError` with the request id preserved
- Query keys are namespaced `["getlib", ...]` and include all filter inputs

## Configuration

```bash
# apps/dashboard/.env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_DATA_SOURCE=fixture
```

Switching requires configuration, never a redesign: hooks branch on `getDataSource()`.

## Next Steps

- **[Vite Quick Start](/vite/quick-start)** - Get started quickly
- **[Theme Customizer](/theme-customizer/)** - Start customizing your theme
