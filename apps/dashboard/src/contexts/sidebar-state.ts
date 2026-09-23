import * as React from "react";

export interface SidebarConfig {
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  side: "left" | "right";
  sidebarWidth: "compact" | "comfortable" | "spacious";
  contentWidth: "fixed" | "fluid" | "container";
}

export interface SidebarContextValue {
  config: SidebarConfig;
  updateConfig: (config: Partial<SidebarConfig>) => void;
}

export const SidebarContext = React.createContext<SidebarContextValue | null>(
  null,
);

export interface LayoutState {
  variant: SidebarConfig["variant"];
  collapsible: SidebarConfig["collapsible"];
  side: SidebarConfig["side"];
}

export const DEFAULT_LAYOUT: LayoutState = {
  variant: "inset",
  collapsible: "offcanvas",
  side: "left",
};

export function sameLayout(a: LayoutState, b: LayoutState): boolean {
  return (
    a.variant === b.variant &&
    a.collapsible === b.collapsible &&
    a.side === b.side
  );
}

const SIDEBAR_WIDTHS: Record<SidebarConfig["sidebarWidth"], string> = {
  compact: "12rem",
  comfortable: "16rem",
  spacious: "20rem",
};

export function sidebarWidthValue(
  width: SidebarConfig["sidebarWidth"],
): string {
  return SIDEBAR_WIDTHS[width];
}

export function contentWidthClass(
  width: SidebarConfig["contentWidth"],
): string {
  if (width === "fixed") return "mx-auto w-full max-w-6xl";
  if (width === "container") return "mx-auto w-full max-w-[1400px]";
  return "";
}
