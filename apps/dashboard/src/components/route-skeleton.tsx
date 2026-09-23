import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route transition fallback for the lazy routes in AppRouter.
 *
 * Mirrors the application shell (sidebar, header, content cards) so a
 * route change shimmers in place instead of flashing a spinner over a
 * blank page. Purely presentational; no providers required.
 */
export function RouteSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-svh w-full"
    >
      <div className="hidden w-64 flex-shrink-0 flex-col gap-2 border-r p-4 md:flex">
        <div className="flex items-center gap-2 px-2 py-2">
          <Skeleton className="size-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <Skeleton key={row} className="h-9 w-full rounded-md" />
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-56 rounded-md" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="space-y-2 px-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((card) => (
              <div
                key={card}
                className="flex flex-col gap-3 rounded-xl border p-6"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
