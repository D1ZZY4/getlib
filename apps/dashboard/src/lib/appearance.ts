/**
 * Dashboard appearance preferences (settings/appearance).
 *
 * Persisted to localStorage (zod-validated, safe fallback) and applied to
 * the live UI: theme through the real theme system, fonts and sizes on the
 * document root, widths through the sidebar config consumed by BaseLayout.
 * Server-side preferences arrive with Phase 3 auth.
 */
import { z } from "zod";
import type { ThemeProviderState } from "@/contexts/theme-context";

export const AppearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontFamily: z.enum(["inter", "system", "mono"]),
  fontSize: z.enum(["small", "medium", "large"]),
  sidebarWidth: z.enum(["compact", "comfortable", "spacious"]),
  contentWidth: z.enum(["fixed", "fluid", "container"]),
});

export type Appearance = z.infer<typeof AppearanceSchema>;

export const appearanceFormSchema = AppearanceSchema;

export type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

/**
 * Full appearance snapshot saved by the Save button: preferences plus
 * the Theme and Layout section state, so one action persists everything
 * visible on the Appearance page.
 */
export const AppearanceSnapshotSchema = AppearanceSchema.extend({
  layout: z.object({
    variant: z.enum(["sidebar", "floating", "inset"]),
    collapsible: z.enum(["offcanvas", "icon", "none"]),
    side: z.enum(["left", "right"]),
  }),
  themeCustom: z.object({
    preset: z.string(),
    tweakcn: z.string(),
    radius: z.string(),
    imported: z
      .object({
        light: z.record(z.string(), z.string()),
        dark: z.record(z.string(), z.string()),
      })
      .nullable(),
  }),
});

export type AppearanceSnapshot = z.infer<typeof AppearanceSnapshotSchema>;

export type ThemeMode = "light" | "dark" | "system";

export type ThemeCustomState = AppearanceSnapshot["themeCustom"];

export const DEFAULT_THEME_CUSTOM: ThemeCustomState = {
  preset: "default",
  tweakcn: "",
  radius: "0.5rem",
  imported: null,
};

export function sameThemeCustom(
  a: ThemeCustomState,
  b: ThemeCustomState,
): boolean {
  return (
    a.preset === b.preset &&
    a.tweakcn === b.tweakcn &&
    a.radius === b.radius &&
    JSON.stringify(a.imported ?? null) ===
      JSON.stringify(b.imported ?? null)
  );
}

export const APPEARANCE_STORAGE_KEY = "getlib-appearance";

export const DEFAULT_APPEARANCE: Appearance = {
  theme: "system",
  fontFamily: "inter",
  fontSize: "medium",
  sidebarWidth: "comfortable",
  contentWidth: "fluid",
};

export const DEFAULT_SNAPSHOT: AppearanceSnapshot = {
  ...DEFAULT_APPEARANCE,
  layout: {
    variant: "inset",
    collapsible: "offcanvas",
    side: "left",
  },
  themeCustom: {
    preset: "default",
    tweakcn: "",
    radius: "0.5rem",
    imported: null,
  },
};

export function loadAppearance(
  storage: Pick<Storage, "getItem"> = localStorage,
): Appearance {
  return loadSnapshot(storage);
}

export function loadSnapshot(
  storage: Pick<Storage, "getItem"> = localStorage,
): AppearanceSnapshot {
  try {
    const raw = storage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = AppearanceSnapshotSchema.safeParse(
      JSON.parse(raw) as unknown,
    );
    if (parsed.success) return parsed.data;
    const legacy = AppearanceSchema.safeParse(JSON.parse(raw) as unknown);
    if (legacy.success) return { ...DEFAULT_SNAPSHOT, ...legacy.data };
    return DEFAULT_SNAPSHOT;
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

export function saveAppearance(
  appearance: Appearance,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  saveSnapshot({ ...DEFAULT_SNAPSHOT, ...appearance }, storage);
}

export function saveSnapshot(
  snapshot: AppearanceSnapshot,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(snapshot));
}

export function saveThemeCustom(
  themeCustom: AppearanceSnapshot["themeCustom"],
  storage: Pick<Storage, "setItem" | "getItem"> = localStorage,
): void {
  saveSnapshot({ ...loadSnapshot(storage), themeCustom }, storage);
}

export function saveLayout(
  layout: AppearanceSnapshot["layout"],
  storage: Pick<Storage, "setItem" | "getItem"> = localStorage,
): void {
  saveSnapshot({ ...loadSnapshot(storage), layout }, storage);
}

export function fontFamilyValue(family: Appearance["fontFamily"]): string {
  if (family === "system") return "system-ui, sans-serif";
  if (family === "mono")
    return 'ui-monospace, "Cascadia Mono", Menlo, monospace';
  return "Inter, system-ui, sans-serif";
}

export function fontSizeValue(size: Appearance["fontSize"]): string {
  if (size === "small") return "14px";
  if (size === "large") return "18px";
  return "16px";
}

export function applyAppearance(
  appearance: Appearance,
  setTheme: ThemeProviderState["setTheme"],
  root: HTMLElement = document.documentElement,
): void {
  setTheme(appearance.theme);
  root.style.setProperty("--font-sans", fontFamilyValue(appearance.fontFamily));
  root.style.fontSize = fontSizeValue(appearance.fontSize);
}
