import { basename } from "node:path";
import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDatabaseClient } from "./client.js";
import { defaultMigrationsFolder, migrateDatabase } from "./migrate.js";
import { type Transactable, withTransaction } from "./transactions.js";

describe("defaultMigrationsFolder", () => {
  it("resolves to the package migrations folder", () => {
    expect(basename(defaultMigrationsFolder())).toBe("migrations");
  });
});

const testUrl = process.env.GETLIB_TEST_DATABASE_URL;

describe.runIf(!!testUrl)("database integration (live PostgreSQL)", () => {
  it("applies migrations and exposes pgvector", async () => {
    const client = createDatabaseClient({
      connectionString: testUrl as string,
    });
    try {
      await migrateDatabase(client.db);
      const ext = await client.pool.query(
        "SELECT COUNT(*)::int AS n FROM pg_extension WHERE extname = 'vector'",
      );
      expect(ext.rows[0]?.n).toBe(1);
      const roundTrip = await client.pool.query("SELECT 1 AS value");
      expect(roundTrip.rows[0]?.value).toBe(1);
    } finally {
      await client.close();
    }
  });

  it("rolls back failed transactions without persisting partial state", async () => {
    const client = createDatabaseClient({
      connectionString: testUrl as string,
    });
    const probeTable = "tx_rollback_probe";
    try {
      await migrateDatabase(client.db);
      interface RawExecutor {
        execute: (query: unknown) => Promise<unknown>;
      }
      await expect(
        withTransaction(client.db as Transactable<RawExecutor>, async (tx) => {
          await tx.execute(
            sql.raw(`CREATE TABLE ${probeTable} (id int PRIMARY KEY)`),
          );
          throw new Error("rollback-probe");
        }),
      ).rejects.toThrow("rollback-probe");
      const check = await client.pool.query(
        "SELECT COUNT(*)::int AS n FROM pg_tables WHERE tablename = $1",
        [probeTable],
      );
      expect(check.rows[0]?.n).toBe(0);
    } finally {
      await client.pool
        .query(`DROP TABLE IF EXISTS ${probeTable}`)
        .catch(() => undefined);
      await client.close();
    }
  });
});
