"use client"

import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  libraryCorpusFixture,
  trustForLibrary,
} from "@/fixtures/libraries"
import { useSearchQuery } from "@/hooks/use-search"

const LIBRARY_OPTIONS = [
  "all",
  "react",
  "@tanstack/react-query",
  "zod",
  "hono",
  "drizzle-orm",
  "typescript",
  "vite",
]

const SOURCE_OPTIONS = ["all", "npm", "github"]

const LIMIT_OPTIONS = ["5", "10", "25"]

function trustVariant(
  trust: "high" | "medium" | "low",
): "default" | "secondary" | "destructive" {
  if (trust === "high") return "default"
  if (trust === "medium") return "secondary"
  return "destructive"
}

export default function SearchPage() {
  const [draft, setDraft] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [library, setLibrary] = useState("all")
  const [version, setVersion] = useState("")
  const [source, setSource] = useState("all")
  const [limit, setLimit] = useState("10")

  const search = useSearchQuery(submitted, {
    library,
    version,
    source,
    limit: Number(limit),
  })

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(draft)
  }

  const matchedLibraries = useMemo(() => {
    const needle = submitted.trim().toLowerCase()
    return libraryCorpusFixture.filter((entry) => {
      if (library !== "all" && entry.name !== library) return false
      if (needle.length === 0) return true
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.ecosystem.toLowerCase().includes(needle)
      )
    })
  }, [submitted, library])

  const totalDocuments = useMemo(
    () =>
      libraryCorpusFixture.reduce((sum, entry) => sum + entry.documents, 0),
    [],
  )

  return (
    <BaseLayout
      title="Search"
      description="Explore libraries and version-aware knowledge with provenance"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={submit}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              <Input
                placeholder="Search libraries, documentation, sections..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="md:max-w-md"
                aria-label="Search query"
              />
              <Select value={library} onValueChange={setLibrary}>
                <SelectTrigger className="md:w-52" aria-label="Filter by library">
                  <SelectValue placeholder="Library" />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All libraries" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Version (optional)"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                className="md:w-40"
                aria-label="Filter by version"
              />
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="md:w-40" aria-label="Filter by source">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All sources" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger className="md:w-28" aria-label="Result limit">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  {LIMIT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="cursor-pointer">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <Tabs defaultValue="libraries" className="w-full">
          <TabsList>
            <TabsTrigger value="libraries">Libraries</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>

          <TabsContent value="libraries" className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Libraries indexed</CardTitle>
                  <CardDescription>Registry coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tabular-nums">
                    {libraryCorpusFixture.length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Searchable documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tabular-nums">
                    {totalDocuments}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Matches</CardTitle>
                  <CardDescription>Libraries for this query</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tabular-nums">
                    {matchedLibraries.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {matchedLibraries.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No libraries found</CardTitle>
                  <CardDescription>
                    No indexed library matches this query.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Sources</TableHead>
                        <TableHead className="text-right">Documents</TableHead>
                        <TableHead className="text-right">Updated</TableHead>
                        <TableHead className="text-right">Trust</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchedLibraries.map((entry) => {
                        const trust = trustForLibrary(entry)
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <Link
                                to={`/libraries/${entry.id}`}
                                className="font-medium hover:underline"
                              >
                                {entry.name}
                              </Link>
                              <p className="text-muted-foreground text-xs">
                                {entry.ecosystem}
                              </p>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {entry.version}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {entry.sources}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {entry.documents}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs">
                              {entry.freshness}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={trustVariant(trust)}>
                                {trust}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="knowledge" className="mt-4">
            {submitted.trim().length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Search the knowledge index</CardTitle>
                  <CardDescription>
                    Results carry library, version, source, and freshness with
                    every match.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : search.isPending ? (
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
            ) : search.error ? (
              <Card role="alert">
                <CardHeader>
                  <CardTitle>Search unavailable</CardTitle>
                  <CardDescription>{search.error.message}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    onClick={() => void search.refetch()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : search.data?.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No results</CardTitle>
                  <CardDescription>
                    Nothing in the index matches this query and filters.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4" role="list" aria-label="Search results">
                {(search.data ?? []).map((result) => (
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
                          variant={
                            result.freshness === "fresh" ? "default" : "secondary"
                          }
                        >
                          {result.freshness}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  )
}
