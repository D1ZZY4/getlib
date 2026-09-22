/**
 * @getlib/database - PostgreSQL client factory.
 *
 * PostgreSQL is the system of record; pgvector is the semantic retrieval
 * layer. Construction is lazy (no network I/O); callers own the lifecycle
 * and must call `close()` when done. No module-level global state.
 */
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import { z } from "zod";

const ClientOptionsSchema = z.object({
  connectionString: z.string().min(1, "connectionString must not be empty"),
  maxConnections: z.number().int().min(1).max(50).default(10),
});

export type DatabaseClientOptions = z.input<typeof ClientOptionsSchema>;

export interface DatabaseClient {
  db: NodePgDatabase;
  pool: Pool;
  close: () => Promise<void>;
}

export function createDatabaseClient(
  rawOptions: DatabaseClientOptions,
): DatabaseClient {
  const options = ClientOptionsSchema.parse(rawOptions);
  const poolConfig: PoolConfig = {
    connectionString: options.connectionString,
    max: options.maxConnections,
  };
  const pool = new Pool(poolConfig);
  const db = drizzle(pool);
  return {
    db,
    pool,
    close: () => pool.end().then(() => undefined),
  };
}
