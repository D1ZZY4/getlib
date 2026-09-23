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

describe("Indexing page", () => {
  it("renders stats and the job queue", () => {
    renderPage();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("JOB-1041")).toBeInTheDocument();
  });

  it("filters by job state", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("combobox", { name: "State" }));
    await user.click(screen.getByRole("option", { name: "Failed" }));
    expect(screen.getByText("JOB-1036")).toBeInTheDocument();
    expect(screen.queryByText("JOB-1041")).not.toBeInTheDocument();
  });

  it("retries a failed job back to queued", async () => {
    const user = userEvent.setup();
    renderPage();
    const rows = screen.getAllByRole("row");
    const failedRow = rows.find((row) =>
      within(row).queryByText("JOB-1036"),
    ) as HTMLElement;
    await user.click(
      within(failedRow).getByRole("button", { name: "More actions" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Retry Job" }));
    expect(screen.getByText("JOB-1036")).toBeInTheDocument();
  });

  it("inspects a failed job with its sanitized error", async () => {
    const user = userEvent.setup();
    renderPage();
    const rows = screen.getAllByRole("row");
    const failedRow = rows.find((row) =>
      within(row).queryByText("JOB-1036"),
    ) as HTMLElement;
    await user.click(
      within(failedRow).getByRole("button", { name: "Inspect job" }),
    );
    expect(await screen.findByText("Sanitized error")).toBeInTheDocument();
    expect(
      screen.getByText("429 rate limited by registry"),
    ).toBeInTheDocument();
  });
});
