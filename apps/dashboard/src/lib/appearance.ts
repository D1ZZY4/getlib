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

export const APPEARANCE_STORAGE_KEY = "getlib-appearance";

export const DEFAULT_APPEARANCE: Appearance = {
  theme: "system",
  fontFamily: "inter",
  fontSize: "medium",
  sidebarWidth: "comfortable",
  contentWidth: "fluid",
};

export function loadAppearance(
  storage: Pick<Storage, "getItem"> = localStorage,
): Appearance {
  try {
    const raw = storage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return DEFAULT_APPEARANCE;
    const parsed = AppearanceSchema.safeParse(JSON.parse(raw) as unknown);
    return parsed.success ? parsed.data : DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function saveAppearance(
  appearance: Appearance,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance));
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
