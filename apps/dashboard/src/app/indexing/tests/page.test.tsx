// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Page from "../page";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";

function renderPage() {
  const ui: ReactNode = <Page />;
  return render(
    <MemoryRouter>
      <SidebarConfigProvider>{ui}</SidebarConfigProvider>
    </MemoryRouter>,
  );
}

function column(name: string): HTMLElement {
  const heading = screen.getByRole("heading", { name });
  const header = heading.closest("div")?.parentElement;
  return header?.parentElement as HTMLElement;
}

describe("Indexing page", () => {
  it("switches between board and table views", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { name: "Running" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByText("JOB-1041")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Board" }));
    expect(screen.getByRole("heading", { name: "Running" })).toBeInTheDocument();
  });

  it("retries a failed job back to queued", async () => {
    const user = userEvent.setup();
    renderPage();
    const attention = column("Needs Attention");
    const retries = within(attention).getAllByRole("button", {
      name: "Retry job",
    });
    await user.click(retries[1] as HTMLElement);
    const queued = column("Queued");
    expect(within(queued).getByText("JOB-1036")).toBeInTheDocument();
  });

  it("cancels a running job", async () => {
    const user = userEvent.setup();
    renderPage();
    const running = column("Running");
    const cancels = within(running).getAllByRole("button", {
      name: "Cancel job",
    });
    await user.click(cancels[0] as HTMLElement);
    expect(
      within(column("Done")).getByText("JOB-1041"),
    ).toBeInTheDocument();
  });

  it("inspects a failed job with its sanitized error", async () => {
    const user = userEvent.setup();
    renderPage();
    const attention = column("Needs Attention");
    const inspectors = within(attention).getAllByRole("button", {
      name: "Inspect job",
    });
    await user.click(inspectors[1] as HTMLElement);
    expect(await screen.findByText("Sanitized error")).toBeInTheDocument();
    expect(
      screen.getByText("429 rate limited by registry"),
    ).toBeInTheDocument();
  });
});
