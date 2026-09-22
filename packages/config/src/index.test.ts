import { describe, expect, it } from "vitest";
import { loadConfig, toSafeSummary } from "./index.js";

describe("@getlib/config", () => {
  it("applies defaults on empty env", () => {
    const c = loadConfig({});
    expect(c.nodeEnv).toBe("development");
    expect(c.apiPort).toBe(3001);
  });

  it("accepts explicit values", () => {
    const c = loadConfig({
      NODE_ENV: "production",
      API_PORT: "4000",
      LOG_LEVEL: "warn",
    });
    expect(c.nodeEnv).toBe("production");
    expect(c.apiPort).toBe(4000);
  });

  it("rejects invalid values (fail fast)", () => {
    expect(() => loadConfig({ NODE_ENV: "staging" })).toThrow();
    expect(() => loadConfig({ API_PORT: "99999" })).toThrow();
  });

  it("never exposes database credentials in safe summary", () => {
    const c = loadConfig({
      DATABASE_URL: "postgres://user:secret@localhost:5432/db",
    });
    const summary = toSafeSummary(c);
    expect(JSON.stringify(summary)).not.toContain("secret");
    expect(summary.databaseConfigured).toBe("true");
  });
});
