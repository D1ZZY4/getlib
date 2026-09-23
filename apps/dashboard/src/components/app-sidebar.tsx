"use client";

import {
  BookOpen,
  CheckSquare,
  FileText,
  Layers,
  LayoutDashboard,
  LayoutPanelLeft,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type * as React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SidebarNotification } from "@/components/sidebar-notification";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "GetLib Admin",
    email: "admin@getlib.local",
    avatar: "",
  },
  navGroups: [
    {
      label: "Knowledge",
      items: [
        {
          title: "Overview",
          url: "/overview",
          icon: LayoutDashboard,
        },
        {
          title: "Libraries",
          url: "/libraries",
          icon: BookOpen,
          items: [
            {
              title: "All Libraries",
              url: "/libraries",
            },
            {
              title: "Add Library",
              url: "/libraries/add",
            },
          ],
        },
        {
          title: "Search",
          url: "/search",
          icon: Search,
        },
        {
          title: "Indexing",
          url: "/indexing",
          icon: Layers,
        },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          title: "Analytics",
          url: "/analytics",
          icon: LayoutPanelLeft,
        },
        {
          title: "Logs",
          url: "/logs",
          icon: FileText,
        },
      ],
    },
    {
      label: "Workspace",
      items: [
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          title: "Settings",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "User Settings",
              url: "/settings/user",
            },
            {
              title: "Account Settings",
              url: "/settings/account",
            },
            {
              title: "Plans & Billing",
              url: "/settings/billing",
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
            },
            {
              title: "Connections",
              url: "/settings/connections",
            },
          ],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">GetLib</span>
                  <span className="truncate text-xs">Knowledge Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotification />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
