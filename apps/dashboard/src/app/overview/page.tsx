/**
 * GetLib Overview surface (doc 06 route model + UI state model).
 *
 * Operational summary rendered from the ENG1-9 server-state hooks.
 * Explicit states: loading, empty, success, stale, recoverable error.
 * Permission-denied and background-operation states arrive with the
 * Phase 3 auth and job-detail slices.
 */
import type { HealthResponse, OverviewSummary } from "@getlib/schemas";
import { useHealthQuery, useOverviewQuery } from "@/hooks/use-overview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function healthVariant(
  status: HealthResponse["status"],
): "default" | "secondary" | "destructive" {
  if (status === "ok") return "default";
  if (status === "degraded") return "secondary";
  return "destructive";
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

function LoadingOverview() {
  return (
    <div role="status" aria-label="Loading overview">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {["libraries", "documents", "jobs"].map((key) => (
          <Card key={key}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ErrorOverview({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card role="alert">
      <CardHeader>
        <CardTitle>Overview unavailable</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No libraries indexed yet</CardTitle>
        <CardDescription>
          Add a library to start building version-aware knowledge. Indexed
          documents, chunks, and jobs will appear here.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function isEmptySummary(summary: OverviewSummary): boolean {
  return (
    summary.libraryCount === 0 &&
    summary.documentCount === 0 &&
    summary.chunkCount === 0 &&
    summary.activeJobs === 0 &&
    summary.failedJobs === 0
  );
}

export default function OverviewPage() {
  const healthQuery = useHealthQuery();
  const overviewQuery = useOverviewQuery();

  if (healthQuery.isPending || overviewQuery.isPending) {
    return <LoadingOverview />;
  }

  const error = healthQuery.error ?? overviewQuery.error;
  if (error) {
    return (
      <ErrorOverview
        message={error.message}
        onRetry={() => {
          void healthQuery.refetch();
          void overviewQuery.refetch();
        }}
      />
    );
  }

  const health = healthQuery.data;
  const summary = overviewQuery.data;
  if (!health || !summary) {
    return <LoadingOverview />;
  }
  const stale = healthQuery.isStale || overviewQuery.isStale;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Service health</CardTitle>
          <CardDescription>
            API and knowledge engine status
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Badge variant={healthVariant(health.status)}>{health.status}</Badge>
          <span className="text-muted-foreground text-sm">
            v{health.version}
          </span>
          {stale ? <Badge variant="outline">Stale</Badge> : null}
        </CardContent>
      </Card>
      {isEmptySummary(summary) ? (
        <EmptyOverview />
      ) : (
        <>
          <StatCard
            label="Libraries"
            value={summary.libraryCount}
            description="Registered libraries under management"
          />
          <StatCard
            label="Documents"
            value={summary.documentCount}
            description={`${summary.chunkCount} chunks indexed`}
          />
          <StatCard
            label="Active jobs"
            value={summary.activeJobs}
            description={`${summary.failedJobs} failed jobs need attention`}
          />
        </>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Freshness</CardTitle>
          <CardDescription>Last overview snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {new Date(summary.generatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
