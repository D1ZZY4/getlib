// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";

function renderPage() {
  const ui: ReactNode = <Page />;
  return render(
    <MemoryRouter>
      <SidebarConfigProvider>{ui}</SidebarConfigProvider>
    </MemoryRouter>,
  );
}

describe("MCP page", () => {
  it("renders endpoint status, catalog, and invocations", () => {
    renderPage();
    expect(screen.getByText("operational")).toBeInTheDocument();
    expect(screen.getAllByText("gl_search").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("gl_dispatch")).toBeInTheDocument();
    expect(screen.getByText("2310ms")).toBeInTheDocument();
  });
});
