import type { UseQueryResult } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { SearchResult } from "@/fixtures/search"

export function KnowledgeResults({
  submitted,
  search,
}: {
  submitted: string
  search: UseQueryResult<SearchResult[], Error>
}) {
  if (submitted.trim().length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Search the knowledge index</CardTitle>
          <CardDescription>
            Results carry library, version, source, and freshness with
            every match.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (search.isPending) {
    return (
      <div role="status" aria-label="Searching">
        <div className="grid gap-4">
          {[0, 1, 2].map((key) => (
            <Card key={key}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (search.error) {
    return (
      <Card role="alert">
        <CardHeader>
          <CardTitle>Search unavailable</CardTitle>
          <CardDescription>{search.error.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={() => void search.refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!search.data || search.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No results</CardTitle>
          <CardDescription>
            Nothing in the index matches this query and filters.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4" role="list" aria-label="Search results">
      {search.data.map((result) => (
        <Card key={result.id} role="listitem">
          <CardHeader>
            <CardTitle className="text-base">{result.document}</CardTitle>
            <CardDescription>
              {result.library}@{result.version} · {result.section}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{result.snippet}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{result.source}</Badge>
              <Badge variant="outline">{result.version}</Badge>
              <Badge
                variant={result.freshness === "fresh" ? "default" : "secondary"}
              >
                {result.freshness}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
