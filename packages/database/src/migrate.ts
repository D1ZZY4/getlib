/**
 * @getlib/database - migration runner.
 *
 * Applies ordered SQL migrations from the package `migrations/` folder.
 * Migrations must stay backward-compatible where practical; destructive
 * schema changes are staged across releases (see doc 19).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export function defaultMigrationsFolder(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");
}

export async function migrateDatabase(
  db: NodePgDatabase,
  migrationsFolder: string = defaultMigrationsFolder(),
): Promise<void> {
  await migrate(db, { migrationsFolder });
}
