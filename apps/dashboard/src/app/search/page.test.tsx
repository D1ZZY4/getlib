// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { GetLibQueryProvider } from "@/lib/query-provider";

function renderPage() {
  const ui: ReactNode = <Page />;
  return render(
    <MemoryRouter>
      <SidebarConfigProvider>
        <GetLibQueryProvider>{ui}</GetLibQueryProvider>
      </SidebarConfigProvider>
    </MemoryRouter>,
  );
}

describe("Search page", () => {
  it("invites a query before searching", () => {
    renderPage();
    expect(screen.getByText("Search the knowledge index")).toBeInTheDocument();
  });

  it("returns version-aware results with provenance", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(
      screen.getByRole("textbox", { name: "Search query" }),
      "query",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText("useQuery reference")).toBeInTheDocument();
    expect(screen.getByText("@tanstack/react-query")).toBeInTheDocument();
    expect(
      screen.getAllByText("5.90.3", { exact: false }).length,
    ).toBeGreaterThan(0);
  });

  it("shows an empty state without matches", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(
      screen.getByRole("textbox", { name: "Search query" }),
      "zzz-no-match",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText("No results")).toBeInTheDocument();
  });
});
