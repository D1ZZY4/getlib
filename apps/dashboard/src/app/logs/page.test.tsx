// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("Logs page", () => {
  it("renders stat cards and the table", () => {
    renderPage();
    expect(screen.getByText("Total Entries")).toBeInTheDocument();
    expect(screen.getByText("12 of 12 entries")).toBeInTheDocument();
    expect(
      screen.getByText("Fetch failed for hono docs: 429 rate limited"),
    ).toBeInTheDocument();
  });

  it("filters by level through the table toolbar", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("combobox", { name: "Filter by level" }));
    await user.click(screen.getByRole("option", { name: "Error" }));
    expect(screen.getByText("2 of 12 entries")).toBeInTheDocument();
    expect(
      screen.queryByText("GET /api/v1/overview/summary 200 (14ms)"),
    ).not.toBeInTheDocument();
  });

  it("narrows by search and shows the empty state", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(
      screen.getByRole("textbox", { name: "Search logs" }),
      "pgvector",
    );
    expect(screen.getByText("1 of 12 entries")).toBeInTheDocument();
    await user.clear(screen.getByRole("textbox", { name: "Search logs" }));
    await user.type(
      screen.getByRole("textbox", { name: "Search logs" }),
      "zzz-no-match",
    );
    expect(screen.getByText("No log entries match")).toBeInTheDocument();
  });

  it("filters by service through the table toolbar", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("combobox", { name: "Filter by service" }),
    );
    const listbox = await screen.findByRole("listbox");
    await user.click(within(listbox).getByRole("option", { name: "mcp" }));
    expect(screen.getByText("2 of 12 entries")).toBeInTheDocument();
  });
});
