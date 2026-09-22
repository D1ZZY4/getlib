import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

async function loadConfig() {
  vi.resetModules();
  const mod = await import("../src/config.js");
  return mod.config;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("invalid env vars throw", () => {
  it("throws on non-numeric GL_TOKEN_LIMIT", async () => {
    vi.stubEnv("GL_TOKEN_LIMIT", "abc");
    await expect(loadConfig()).rejects.toThrow('Invalid GL_TOKEN_LIMIT: "abc"');
  });

  it("throws on negative GL_TOKEN_LIMIT", async () => {
    vi.stubEnv("GL_TOKEN_LIMIT", "-1");
    await expect(loadConfig()).rejects.toThrow("Invalid GL_TOKEN_LIMIT");
  });

  it("throws on invalid GL_LOG_FORMAT", async () => {
    vi.stubEnv("GL_LOG_FORMAT", "xml");
    await expect(loadConfig()).rejects.toThrow('Invalid GL_LOG_FORMAT: "xml"');
  });

  it("throws on invalid GL_LOG_LEVEL", async () => {
    vi.stubEnv("GL_LOG_LEVEL", "verbose");
    await expect(loadConfig()).rejects.toThrow('Invalid GL_LOG_LEVEL: "verbose"');
  });

  it("throws on alphabetic GL_CACHE_TTL_MS", async () => {
    vi.stubEnv("GL_CACHE_TTL_MS", "abc");
    await expect(loadConfig()).rejects.toThrow("Invalid GL_CACHE_TTL_MS");
  });

  it("throws on empty string GL_FETCH_TIMEOUT_MS", async () => {
    vi.stubEnv("GL_FETCH_TIMEOUT_MS", "");
    await expect(loadConfig()).rejects.toThrow("Invalid GL_FETCH_TIMEOUT_MS");
  });
});

describe("config is frozen", () => {
  it("the config object is frozen", async () => {
    const cfg = await loadConfig();
    expect(Object.isFrozen(cfg)).toBe(true);
  });

  it("assigning a property throws in strict mode", async () => {
    const cfg = await loadConfig();
    expect(() => {
      "use strict";
      (cfg as Record<string, unknown>)["tokenLimit"] = 9999;
    }).toThrow();
  });
});
