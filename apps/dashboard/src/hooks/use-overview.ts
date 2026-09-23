/**
 * GetLib server-state hooks (doc 06 data architecture).
 *
 * TanStack Query owns caching, staleness, retries and cancellation.
 * Components consume isPending/error/data directly to render the doc 06
 * UI states (loading, stale, recoverable error). No global-store mirror.
 */

import type { HealthResponse, OverviewSummary } from "@getlib/schemas";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { healthFixture, overviewFixture } from "@/fixtures/overview";
import {
  getHealth,
  getOverviewSummary,
  resolveApiBaseUrl,
} from "@/lib/api-client";
import { getDataSource } from "@/lib/data-source";

function useLiveApi(): boolean {
  return getDataSource() === "api";
}

function apiBaseUrl(): string {
  return resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
}

export function useHealthQuery(): UseQueryResult<HealthResponse, Error> {
  const live = useLiveApi();
  return useQuery({
    queryKey: ["getlib", "health"],
    queryFn: ({ signal }) =>
      live
        ? getHealth({ baseUrl: apiBaseUrl(), signal })
        : Promise.resolve(healthFixture),
  });
}

export function useOverviewQuery(): UseQueryResult<OverviewSummary, Error> {
  const live = useLiveApi();
  return useQuery({
    queryKey: ["getlib", "overview", "summary"],
    queryFn: ({ signal }) =>
      live
        ? getOverviewSummary({ baseUrl: apiBaseUrl(), signal })
        : Promise.resolve(overviewFixture),
  });
}
