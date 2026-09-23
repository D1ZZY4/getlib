// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
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

async function searchFor(user: ReturnType<typeof userEvent.setup>, query: string) {
  await user.type(screen.getByRole("textbox", { name: "Search query" }), query);
  await user.click(screen.getByRole("button", { name: "Search" }));
  await user.click(screen.getByRole("tab", { name: "Knowledge" }));
}

describe("Search page", () => {
  it("explores indexed libraries with trust signals", () => {
    renderPage();
    const table = screen.getByRole("table");
    expect(screen.getByText("Libraries indexed")).toBeInTheDocument();
    expect(within(table).getByText("react")).toBeInTheDocument();
    expect(within(table).getAllByText("high").length).toBeGreaterThan(0);
  });

  it("filters the library table by query", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByRole("textbox", { name: "Search query" }), "zod");
    await user.click(screen.getByRole("button", { name: "Search" }));
    const table = screen.getByRole("table");
    expect(within(table).getByText("zod")).toBeInTheDocument();
    expect(within(table).queryByText("hono")).not.toBeInTheDocument();
  });

  it("returns version-aware knowledge results with provenance", async () => {
    const user = userEvent.setup();
    renderPage();
    await searchFor(user, "query");
    expect(await screen.findByText("useQuery reference")).toBeInTheDocument();
    expect(screen.getByText("@tanstack/react-query")).toBeInTheDocument();
    expect(
      screen.getAllByText("5.90.3", { exact: false }).length,
    ).toBeGreaterThan(0);
  });

  it("shows an empty state without matches", async () => {
    const user = userEvent.setup();
    renderPage();
    await searchFor(user, "zzz-no-match");
    expect(await screen.findByText("No results")).toBeInTheDocument();
  });
});
