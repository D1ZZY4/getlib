"use client";

import type * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { contentWidthClass, sidebarWidthValue } from "@/contexts/sidebar-state";
import { useSidebarConfig } from "@/hooks/use-sidebar-config";

interface BaseLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

function PageHeader({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  if (!title) return null;
  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

function PageBody({
  children,
  title,
  description,
  contentClass,
}: BaseLayoutProps & { contentClass: string }) {
  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div
            className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 ${contentClass}`}
          >
            <PageHeader title={title} description={description} />
            {children}
          </div>
        </div>
      </div>
      <SiteFooter />
    </SidebarInset>
  );
}

export function BaseLayout({ children, title, description }: BaseLayoutProps) {
  const { config } = useSidebarConfig();
  const contentClass = contentWidthClass(config.contentWidth);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarWidthValue(config.sidebarWidth),
          "--sidebar-width-icon": "3rem",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
      className={config.collapsible === "none" ? "sidebar-none-mode" : ""}
    >
      {config.side === "left" ? (
        <>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <PageBody
            title={title}
            description={description}
            contentClass={contentClass}
          >
            {children}
          </PageBody>
        </>
      ) : (
        <>
          <PageBody
            title={title}
            description={description}
            contentClass={contentClass}
          >
            {children}
          </PageBody>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}
    </SidebarProvider>
  );
}
