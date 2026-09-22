import { describe, expect, it } from "vitest";
import { createDatabaseClient } from "./client.js";

describe("createDatabaseClient", () => {
  it("rejects an empty connection string (fail fast)", () => {
    expect(() => createDatabaseClient({ connectionString: "" })).toThrow();
  });

  it("rejects out-of-range pool sizes", () => {
    expect(() =>
      createDatabaseClient({
        connectionString: "postgres://x",
        maxConnections: 0,
      }),
    ).toThrow();
    expect(() =>
      createDatabaseClient({
        connectionString: "postgres://x",
        maxConnections: 51,
      }),
    ).toThrow();
  });

  it("constructs lazily without connecting and closes cleanly", async () => {
    const client = createDatabaseClient({
      connectionString: "postgres://getlib:getlib@localhost:5432/getlib",
    });
    expect(client.db).toBeDefined();
    expect(client.pool).toBeDefined();
    await client.close();
  });
});
