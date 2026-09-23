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
  fontFamily: z.enum(["inter", "system", "macos", "mono"]),
  fontSize: z.enum(["small", "medium", "large"]),
  sidebarWidth: z.enum(["compact", "comfortable", "spacious"]),
  contentWidth: z.enum(["fixed", "fluid", "container"]),
});

export type Appearance = z.infer<typeof AppearanceSchema>;

export const appearanceFormSchema = AppearanceSchema;

export type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

/**
 * Toast notification preferences (appearance page, toast section).
 *
 * Defaults mirror sonner 2.x built-in behavior (bottom-right, 4000ms,
 * 3 visible, 8px radius, collapsed, no close button) so a fresh install
 * renders exactly like before this setting existed.
 */
export const ToastPositionSchema = z.enum([
  "top-left",
  "top-right",
  "top-center",
  "bottom-left",
  "bottom-right",
  "bottom-center",
]);

export const ToastSettingsSchema = z.object({
  position: ToastPositionSchema.default("bottom-right"),
  durationMs: z.number().int().min(1000).max(15000).default(4000),
  visibleToasts: z.number().int().min(1).max(5).default(3),
  radiusPx: z.number().int().min(0).max(24).default(8),
  expanded: z.boolean().default(false),
  closeButton: z.boolean().default(false),
});

export type ToastPosition = z.infer<typeof ToastPositionSchema>;
export type ToastSettings = z.infer<typeof ToastSettingsSchema>;

export const DEFAULT_TOAST: ToastSettings = {
  position: "bottom-right",
  durationMs: 4000,
  visibleToasts: 3,
  radiusPx: 8,
  expanded: false,
  closeButton: false,
};

export function sameToast(a: ToastSettings, b: ToastSettings): boolean {
  return (
    a.position === b.position &&
    a.durationMs === b.durationMs &&
    a.visibleToasts === b.visibleToasts &&
    a.radiusPx === b.radiusPx &&
    a.expanded === b.expanded &&
    a.closeButton === b.closeButton
  );
}

/** Same-tab broadcast so the mounted Toaster picks up saved changes. */
export const TOAST_SETTINGS_EVENT = "getlib:toast-settings-changed";

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
  // Defaulted (not required) so snapshots saved before this setting
  // existed still parse fully and keep their layout and themeCustom.
  toast: ToastSettingsSchema.default(DEFAULT_TOAST),
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
    JSON.stringify(a.imported ?? null) === JSON.stringify(b.imported ?? null)
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
  toast: DEFAULT_TOAST,
};

const memoryFallback: Pick<Storage, "getItem" | "setItem"> = {
  getItem: () => null,
  setItem: () => undefined,
} as Pick<Storage, "getItem" | "setItem">;

function safeStorage(): Pick<Storage, "getItem" | "setItem"> | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function loadAppearance(
  storage: Pick<Storage, "getItem"> = safeStorage() ?? memoryFallback,
): Appearance {
  return loadSnapshot(storage);
}

export function loadSnapshot(
  storage: Pick<Storage, "getItem"> = safeStorage() ?? memoryFallback,
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
  storage: Pick<Storage, "setItem"> = safeStorage() ?? memoryFallback,
): void {
  saveSnapshot({ ...DEFAULT_SNAPSHOT, ...appearance }, storage);
}

export function saveSnapshot(
  snapshot: AppearanceSnapshot,
  storage: Pick<Storage, "setItem"> = safeStorage() ?? memoryFallback,
): void {
  storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(snapshot));
}

export function saveThemeCustom(
  themeCustom: AppearanceSnapshot["themeCustom"],
  storage: Pick<Storage, "setItem" | "getItem"> = safeStorage() ??
    memoryFallback,
): void {
  saveSnapshot({ ...loadSnapshot(storage), themeCustom }, storage);
}

export function saveToastSettings(
  toast: AppearanceSnapshot["toast"],
  storage: Pick<Storage, "setItem" | "getItem"> = safeStorage() ??
    memoryFallback,
): void {
  saveSnapshot({ ...loadSnapshot(storage), toast }, storage);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(TOAST_SETTINGS_EVENT));
  }
}

export function saveLayout(
  layout: AppearanceSnapshot["layout"],
  storage: Pick<Storage, "setItem" | "getItem"> = safeStorage() ??
    memoryFallback,
): void {
  saveSnapshot({ ...loadSnapshot(storage), layout }, storage);
}

export function fontFamilyValue(family: Appearance["fontFamily"]): string {
  if (family === "system") return "system-ui, sans-serif";
  if (family === "macos") {
    return '-apple-system, BlinkMacSystemFont, "SF Pro", "SF Pro Text", Inter, system-ui, sans-serif';
  }
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

/**
 * Theme radius as a 0-100 smoothness percentage.
 * 100% is 1rem (the previous maximum); 60% reads like macOS curvature.
 */
export function radiusRemToPercent(rem: string): number {
  const parsed = Number.parseFloat(rem);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.min(100, Math.round(parsed * 100));
}

export function radiusPercentToRem(percent: number): string {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  if (clamped === 0) return "0rem";
  const value = clamped / 100;
  return `${Number.isInteger(value) ? value : String(value.toFixed(2)).replace(/0$/, "")}rem`;
}
