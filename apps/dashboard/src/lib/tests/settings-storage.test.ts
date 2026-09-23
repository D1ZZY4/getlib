import { describe, expect, it } from "vitest";
import { z } from "zod";
import { loadSetting, saveSetting } from "../settings-storage";

const TestSchema = z.object({ name: z.string().min(1) });

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const store = { ...initial };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key of Object.keys(store)) delete store[key];
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
}

describe("settings-storage", () => {
  it("round-trips validated payloads", () => {
    const storage = memoryStorage();
    saveSetting("test-key", { name: "ada" }, storage);
    expect(
      loadSetting("test-key", TestSchema, { name: "fallback" }, storage),
    ).toEqual({ name: "ada" });
  });

  it("falls back on missing or invalid payloads", () => {
    const storage = memoryStorage({
      "bad-key": "not-json{",
      "wrong-key": JSON.stringify({ name: "" }),
    });
    expect(
      loadSetting("missing-key", TestSchema, { name: "fallback" }, storage),
    ).toEqual({ name: "fallback" });
    expect(
      loadSetting("bad-key", TestSchema, { name: "fallback" }, storage),
    ).toEqual({ name: "fallback" });
    expect(
      loadSetting("wrong-key", TestSchema, { name: "fallback" }, storage),
    ).toEqual({ name: "fallback" });
  });
});
