// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

function renderAt(path: string) {
  const ui: ReactNode = <Page />;
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarConfigProvider>
          <Routes>
            <Route path="/libraries/:id" element={ui} />
          </Routes>
          <Toaster />
        </SidebarConfigProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("Library detail page", () => {
  it("renders header, tabs, and versions", async () => {
    renderAt("/libraries/lib-react");
    expect(await screen.findByText("19.3.0")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Versions" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Knowledge" })).toBeInTheDocument();
  });

  it("shows sources and knowledge counts", async () => {
    const user = userEvent.setup();
    renderAt("/libraries/lib-react");
    await user.click(screen.getByRole("tab", { name: "Sources" }));
    expect(
      screen.getByText("https://www.npmjs.com/package/react"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Knowledge" }));
    expect(screen.getByText("Documents")).toBeInTheDocument();
  });

  it("shows an empty state for unknown libraries", () => {
    renderAt("/libraries/nope");
    expect(screen.getByText("Library not found")).toBeInTheDocument();
  });
});
