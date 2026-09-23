// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Page from "../page";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { healthFixture, overviewFixture } from "@/fixtures/overview";
import {
  useHealthQuery,
  useOverviewQuery,
} from "@/hooks/use-overview";
import type { UseQueryResult } from "@tanstack/react-query";
import type { HealthResponse, OverviewSummary } from "@getlib/schemas";

vi.mock("@/hooks/use-overview", () => ({
  useHealthQuery: vi.fn(),
  useOverviewQuery: vi.fn(),
}));

const healthQuery = vi.mocked(useHealthQuery);
const overviewQuery = vi.mocked(useOverviewQuery);

function queryResult<T>(overrides: {
  data?: T;
  isPending?: boolean;
  isStale?: boolean;
  error?: Error | null;
  refetch?: () => Promise<unknown>;
}): UseQueryResult<T, Error> {
  return {
    data: overrides.data,
    isPending: overrides.isPending ?? false,
    isStale: overrides.isStale ?? false,
    error: overrides.error ?? null,
    refetch: overrides.refetch ?? (() => Promise.resolve()),
  } as UseQueryResult<T, Error>;
}

function mockSuccess(
  summary: OverviewSummary = overviewFixture,
) {
  healthQuery.mockReturnValue(
    queryResult<HealthResponse>({ data: healthFixture }),
  );
  overviewQuery.mockReturnValue(queryResult({ data: summary }));
}

function renderContent() {
  return within(screen.getByRole("main"));
}

function renderPage(ui: ReactNode = <Page />) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <SidebarConfigProvider>{ui}</SidebarConfigProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("Dashboard OverviewPage", () => {
  it("renders loading skeletons while queries are pending", () => {
    healthQuery.mockReturnValue(queryResult({ isPending: true }));
    overviewQuery.mockReturnValue(queryResult({ isPending: true }));
    renderPage();
    expect(screen.getByRole("status", { name: "Loading overview" })).toBeInTheDocument();
  });

  it("renders fixture-backed summary, health, activity, and recents", () => {
    mockSuccess();
    renderPage();
    expect(renderContent().getByText("Libraries")).toBeInTheDocument();
    expect(renderContent().getByText("12")).toBeInTheDocument();
    expect(renderContent().getByText("ok")).toBeInTheDocument();
    expect(screen.getByText("Uptime 1d 2h")).toBeInTheDocument();
    expect(renderContent().getByText("Indexing Activity")).toBeInTheDocument();
    expect(renderContent().getByText("Recently indexed")).toBeInTheDocument();
    expect(renderContent().getByText("useQuery reference")).toBeInTheDocument();
    expect(screen.queryByText("Stale snapshot")).not.toBeInTheDocument();
  });

  it("renders an empty state when nothing is indexed", () => {
    mockSuccess({
      libraryCount: 0,
      documentCount: 0,
      chunkCount: 0,
      activeJobs: 0,
      failedJobs: 0,
      generatedAt: "2026-09-23T07:00:00.000Z",
    });
    renderPage();
    expect(screen.getByText("No libraries indexed yet")).toBeInTheDocument();
  });

  it("renders a recoverable error with a working retry action", async () => {
    const user = userEvent.setup();
    const refetchHealth = vi.fn(() => Promise.resolve());
    const refetchOverview = vi.fn(() => Promise.resolve());
    healthQuery.mockReturnValue(
      queryResult({ error: new Error("service unreachable"), refetch: refetchHealth }),
    );
    overviewQuery.mockReturnValue(
      queryResult<OverviewSummary>({ data: overviewFixture, refetch: refetchOverview }),
    );
    renderPage();
    expect(screen.getByRole("alert")).toHaveTextContent("service unreachable");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetchHealth).toHaveBeenCalledTimes(1);
    expect(refetchOverview).toHaveBeenCalledTimes(1);
  });

  it("renders stale data without any stale badge", () => {
    healthQuery.mockReturnValue(
      queryResult<HealthResponse>({ data: healthFixture, isStale: true }),
    );
    overviewQuery.mockReturnValue(
      queryResult({ data: overviewFixture, isStale: true }),
    );
    renderPage();
    expect(screen.queryByText("Stale snapshot")).not.toBeInTheDocument();
    expect(renderContent().getByText("12")).toBeInTheDocument();
  });

  it("resolves live hooks to fixtures without network in jsdom", async () => {
    const actual = await vi.importActual<typeof import("@/hooks/use-overview")>(
      "@/hooks/use-overview",
    );
    healthQuery.mockImplementation(() => actual.useHealthQuery());
    overviewQuery.mockImplementation(() => actual.useOverviewQuery());
    renderPage();
    expect(await renderContent().findByText("Libraries")).toBeInTheDocument();
    expect(renderContent().getByText("12")).toBeInTheDocument();
  });
});
