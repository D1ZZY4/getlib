import { describe, expect, it } from "vitest";
import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  fontFamilyValue,
  fontSizeValue,
  loadAppearance,
  saveAppearance,
  type Appearance,
} from "./appearance";

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

describe("appearance preferences", () => {
  it("falls back to defaults on missing or invalid storage", () => {
    expect(loadAppearance(memoryStorage())).toEqual(DEFAULT_APPEARANCE);
    expect(
      loadAppearance(memoryStorage({ [APPEARANCE_STORAGE_KEY]: "nope{" })),
    ).toEqual(DEFAULT_APPEARANCE);
    expect(
      loadAppearance(
        memoryStorage({ [APPEARANCE_STORAGE_KEY]: '{"theme":"neon"}' }),
      ),
    ).toEqual(DEFAULT_APPEARANCE);
  });

  it("round-trips valid preferences", () => {
    const storage = memoryStorage();
    const prefs: Appearance = {
      ...DEFAULT_APPEARANCE,
      theme: "dark",
      fontSize: "large",
    };
    saveAppearance(prefs, storage);
    expect(loadAppearance(storage)).toEqual(prefs);
  });

  it("maps families and sizes to real CSS values", () => {
    expect(fontFamilyValue("inter")).toContain("Inter");
    expect(fontFamilyValue("system")).toContain("system-ui");
    expect(fontFamilyValue("mono")).toContain("monospace");
    expect(fontSizeValue("small")).toBe("14px");
    expect(fontSizeValue("medium")).toBe("16px");
    expect(fontSizeValue("large")).toBe("18px");
  });
});
