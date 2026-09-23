"use client"

import * as React from "react"
import {
  SidebarContext,
  type SidebarConfig,
} from "@/contexts/sidebar-state"
import { loadAppearance } from "@/lib/appearance"

export function SidebarConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<SidebarConfig>(() => {
    const stored = loadAppearance()
    return {
      variant: "inset",
      collapsible: "offcanvas",
      side: "left",
      sidebarWidth: stored.sidebarWidth,
      contentWidth: stored.contentWidth,
    }
  })

  const updateConfig = React.useCallback((newConfig: Partial<SidebarConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  return (
    <SidebarContext.Provider value={{ config, updateConfig }}>
      {children}
    </SidebarContext.Provider>
  )
}
