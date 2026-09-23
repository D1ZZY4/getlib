"use client";

import * as React from "react";
import { type SidebarConfig, SidebarContext } from "@/contexts/sidebar-state";
import { loadSnapshot } from "@/lib/appearance";

export function SidebarConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = React.useState<SidebarConfig>(() => {
    const stored = loadSnapshot();
    return {
      variant: stored.layout.variant,
      collapsible: stored.layout.collapsible,
      side: stored.layout.side,
      sidebarWidth: stored.sidebarWidth,
      contentWidth: stored.contentWidth,
    };
  });

  const updateConfig = React.useCallback(
    (newConfig: Partial<SidebarConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }));
    },
    [],
  );

  return (
    <SidebarContext.Provider value={{ config, updateConfig }}>
      {children}
    </SidebarContext.Provider>
  );
}
