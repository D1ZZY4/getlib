// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

describe("Libraries page", () => {
  it("renders stat cards and the table", () => {
    renderPage();
    expect(screen.getByText("Total Libraries")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("5.90.3")).toBeInTheDocument();
  });

  it("filters by indexing state", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("combobox", { name: "Indexing" }));
    await user.click(screen.getByRole("option", { name: "Failed" }));
    expect(screen.getByText("recharts")).toBeInTheDocument();
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });

  it("narrows by search and shows the empty state", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(
      screen.getByRole("textbox", { name: "Search libraries" }),
      "zod",
    );
    expect(screen.getByText("zod")).toBeInTheDocument();
    expect(screen.queryByText("hono")).not.toBeInTheDocument();
    await user.clear(screen.getByRole("textbox", { name: "Search libraries" }));
    await user.type(
      screen.getByRole("textbox", { name: "Search libraries" }),
      "zzz-no-match",
    );
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("navigates to the add page", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/libraries"]}>
        <SidebarConfigProvider>
          <Routes>
            <Route path="/libraries" element={<Page />} />
            <Route
              path="/libraries/add"
              element={<div>Add Library Page</div>}
            />
          </Routes>
        </SidebarConfigProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Add Library" }));
    expect(await screen.findByText("Add Library Page")).toBeInTheDocument();
  });

  it("deletes entries through row actions", async () => {
    const user = userEvent.setup();
    renderPage();
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1] as HTMLElement;
    await user.click(
      within(firstDataRow).getByRole("button", { name: "More actions" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Delete Library" }));
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });
});
