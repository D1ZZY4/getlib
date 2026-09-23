import { describe, expect, it } from "vitest";
import {
  APPEARANCE_STORAGE_KEY,
  type Appearance,
  type AppearanceSnapshot,
  DEFAULT_APPEARANCE,
  DEFAULT_SNAPSHOT,
  fontFamilyValue,
  fontSizeValue,
  loadAppearance,
  loadSnapshot,
  saveAppearance,
  saveLayout,
  saveSnapshot,
  saveThemeCustom,
} from "../appearance";

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
    expect(loadSnapshot(memoryStorage())).toEqual(DEFAULT_SNAPSHOT);
    expect(loadAppearance(memoryStorage())).toMatchObject(DEFAULT_APPEARANCE);
    expect(
      loadSnapshot(memoryStorage({ [APPEARANCE_STORAGE_KEY]: "nope{" })),
    ).toEqual(DEFAULT_SNAPSHOT);
    expect(
      loadSnapshot(
        memoryStorage({ [APPEARANCE_STORAGE_KEY]: '{"theme":"neon"}' }),
      ),
    ).toEqual(DEFAULT_SNAPSHOT);
  });

  it("upgrades legacy preference payloads", () => {
    const legacy: Appearance = { ...DEFAULT_APPEARANCE, theme: "dark" };
    const storage = memoryStorage({
      [APPEARANCE_STORAGE_KEY]: JSON.stringify(legacy),
    });
    expect(loadSnapshot(storage)).toEqual({ ...DEFAULT_SNAPSHOT, ...legacy });
    expect(loadAppearance(storage).theme).toBe("dark");
  });

  it("round-trips full snapshots", () => {
    const storage = memoryStorage();
    const snapshot: AppearanceSnapshot = {
      ...DEFAULT_SNAPSHOT,
      theme: "dark",
      layout: { variant: "floating", collapsible: "icon", side: "right" },
      themeCustom: {
        preset: "zinc",
        tweakcn: "",
        radius: "0.75rem",
        imported: null,
      },
    };
    saveSnapshot(snapshot, storage);
    expect(loadSnapshot(storage)).toEqual(snapshot);
  });

  it("saves theme and layout sections independently", () => {
    const storage = memoryStorage();
    saveThemeCustom(
      { preset: "zinc", tweakcn: "", radius: "0.75rem", imported: null },
      storage,
    );
    expect(loadSnapshot(storage).themeCustom.preset).toBe("zinc");
    expect(loadSnapshot(storage).theme).toBe("system");
    saveLayout(
      { variant: "floating", collapsible: "icon", side: "right" },
      storage,
    );
    const snapshot = loadSnapshot(storage);
    expect(snapshot.layout.side).toBe("right");
    expect(snapshot.themeCustom.preset).toBe("zinc");
  });
  it("saves preferences merged over snapshot defaults", () => {
    const storage = memoryStorage();
    saveAppearance({ ...DEFAULT_APPEARANCE, fontSize: "large" }, storage);
    expect(loadAppearance(storage).fontSize).toBe("large");
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
