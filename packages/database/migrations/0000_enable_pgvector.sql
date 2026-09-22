-- Phase 1 foundation: pgvector is the semantic retrieval layer.
-- Domain tables arrive with their owning phases; this migration only
-- guarantees the extension exists. Idempotent for safe re-runs.
CREATE EXTENSION IF NOT EXISTS "vector";
--> statement-breakpoint
