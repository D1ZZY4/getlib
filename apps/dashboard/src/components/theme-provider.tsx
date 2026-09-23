"use client";

import * as React from "react";
import { ThemeProviderContext } from "@/contexts/theme-context";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

function readStoredTheme(storageKey: string, fallback: Theme): Theme {
  try {
    if (typeof localStorage === "undefined") return fallback;
    return (localStorage.getItem(storageKey) as Theme) || fallback;
  } catch {
    return fallback;
  }
}

function persistTheme(storageKey: string, theme: Theme): void {
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Private mode / SSR: theme still applies for this session.
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() =>
    readStoredTheme(storageKey, defaultTheme),
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (next: Theme) => {
        persistTheme(storageKey, next);
        setTheme(next);
      },
    }),
    [theme, storageKey],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
