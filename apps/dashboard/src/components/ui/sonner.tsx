import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import {
  DEFAULT_TOAST,
  loadSnapshot,
  TOAST_SETTINGS_EVENT,
  type ToastSettings,
} from "@/lib/appearance";

function useToastSettings(): ToastSettings {
  const [settings, setSettings] = useState<ToastSettings>(
    () => loadSnapshot().toast ?? DEFAULT_TOAST,
  );

  useEffect(() => {
    const reload = () => setSettings(loadSnapshot().toast ?? DEFAULT_TOAST);
    window.addEventListener("storage", reload);
    window.addEventListener(TOAST_SETTINGS_EVENT, reload);
    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener(TOAST_SETTINGS_EVENT, reload);
    };
  }, []);

  return settings;
}

const Toaster = ({ ...props }: ToasterProps) => {
  // App provider theme (not next-themes: no NextThemesProvider is mounted,
  // so that hook only ever returned its fallback here).
  const { theme = "system" } = useTheme();
  const toast = useToastSettings();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={toast.position}
      expand={toast.expanded}
      visibleToasts={toast.visibleToasts}
      closeButton={toast.closeButton}
      toastOptions={{
        duration: toast.durationMs,
        style: { borderRadius: `${toast.radiusPx}px` },
      }}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
