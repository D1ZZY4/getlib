/**
 * Minimal persisted-settings helper for template settings forms.
 *
 * Mirrors the appearance module's storage discipline: localStorage behind a
 * safe accessor (SSR / private-mode safe with an in-memory fallback), JSON
 * payloads validated with zod on load so malformed values fall back to
 * defaults instead of crashing the form.
 */
import type { z } from "zod";

const memoryFallback = new Map<string, string>();

function safeStorage(): Pick<Storage, "getItem" | "setItem"> | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function loadSetting<T>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
  storage: Pick<Storage, "getItem"> | null = safeStorage(),
): T {
  try {
    const raw = storage?.getItem(key) ?? memoryFallback.get(key) ?? null;
    if (!raw) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw) as unknown);
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export function saveSetting(
  key: string,
  value: unknown,
  storage: Pick<Storage, "setItem"> | null = safeStorage(),
): void {
  try {
    const serialized = JSON.stringify(value);
    if (storage) storage.setItem(key, serialized);
    else memoryFallback.set(key, serialized);
  } catch {
    // Quota / private mode: settings still apply for this session.
  }
}
