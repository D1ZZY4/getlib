// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Page from "../page";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const ui: ReactNode = <Page />;
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <SidebarConfigProvider>{ui}</SidebarConfigProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("Analytics page", () => {
  it("renders converted widgets with fixture data", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Analytics" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Search Activity")).toBeInTheDocument();
    expect(screen.getByText("Knowledge by Source")).toBeInTheDocument();
    expect(screen.getByText("Recent Indexing Jobs")).toBeInTheDocument();
    expect(screen.getByText("Top Libraries")).toBeInTheDocument();
    expect(screen.getByText("Retrieval Insights")).toBeInTheDocument();
    expect(screen.getByText("8,412")).toBeInTheDocument();
    expect(screen.getByText("JOB-1041")).toBeInTheDocument();
  });

  it("refreshes server state without errors", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /refresh data/i }));
    expect(
      screen.getByRole("heading", { name: "Analytics" }),
    ).toBeInTheDocument();
  });
});
