import { describe, expect, it } from "vitest";
import { type Transactable, withTransaction } from "./transactions.js";

describe("withTransaction", () => {
  it("returns the callback result and passes the tx through", async () => {
    const tx = Symbol("tx");
    const db: Transactable<unknown> = {
      async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
        return fn(tx);
      },
    };
    const result = await withTransaction(db, async (t) => {
      expect(t).toBe(tx);
      return "ok";
    });
    expect(result).toBe("ok");
  });

  it("propagates callback errors without swallowing them", async () => {
    const db: Transactable<unknown> = {
      async transaction<T>(): Promise<T> {
        throw new Error("boom");
      },
    };
    await expect(
      withTransaction(db, async () => "unreachable"),
    ).rejects.toThrow("boom");
  });
});
