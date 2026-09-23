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
    expect(screen.getByText("Errors")).toBeInTheDocument();
    expect(
      screen.getByText("Fetch failed for hono docs: 429 rate limited"),
    ).toBeInTheDocument();
  });

  it("filters by level through the table toolbar", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("combobox", { name: "Level" }));
    await user.click(screen.getByRole("option", { name: "Error" }));
    expect(
      screen.getByText("Fetch failed for hono docs: 429 rate limited"),
    ).toBeInTheDocument();
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
    expect(
      screen.getByText("pgvector index scan: 1240 candidates, 0.8ms"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Fetch failed for hono docs: 429 rate limited"),
    ).not.toBeInTheDocument();
    await user.clear(screen.getByRole("textbox", { name: "Search logs" }));
    await user.type(
      screen.getByRole("textbox", { name: "Search logs" }),
      "zzz-no-match",
    );
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("filters by service and pages the table", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("combobox", { name: "Service" }));
    const listbox = await screen.findByRole("listbox");
    await user.click(within(listbox).getByRole("option", { name: "mcp" }));
    expect(
      screen.getByText("gl_search served 6 results with provenance (88ms)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Page")).toBeInTheDocument();
  });

  it("adds entries through the add dialog", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Add Log Entry" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(
      within(dialog).getByLabelText("Message"),
      "probe entry",
    );
    await user.type(within(dialog).getByLabelText("Request ID"), "req-probe");
    await user.click(within(dialog).getByRole("combobox", { name: "Level" }));
    await user.click(screen.getByRole("option", { name: "Info" }));
    await user.type(within(dialog).getByLabelText("Time"), "09:00:00");
    await user.type(within(dialog).getByLabelText("Request"), "req-probe");
    await user.click(
      within(dialog).getByRole("combobox", { name: "Service" }),
    );
    await user.click(screen.getByRole("option", { name: "api" }));
    await user.click(
      within(dialog).getByRole("button", { name: "Save Log" }),
    );
    expect(screen.getByText("probe entry")).toBeInTheDocument();
  });
});
