"use client"

import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VersionsTable } from "../components/versions-table"
import { libraryVersionsFixture } from "@/fixtures/libraries"
import initialLibrariesData from "../data.json"

function indexingVariant(
  indexing: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (indexing === "indexed") return "default"
  if (indexing === "indexing") return "secondary"
  if (indexing === "failed") return "destructive"
  return "outline"
}

export default function LibraryDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const entry = initialLibrariesData.find((item) => item.id === id)

  if (!entry) {
    return (
      <BaseLayout
        title="Library Detail"
        description="Version-aware knowledge for one library"
      >
        <div className="@container/main px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Library not found</CardTitle>
              <CardDescription>
                No library matches this identifier in the fixture corpus.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </BaseLayout>
    )
  }

  const chunks = entry.documents * 8
  const examples = entry.documents * 2
  const snippets = entry.documents * 3
  const sources = [
    {
      type: "registry",
      url: `https://www.npmjs.com/package/${entry.name}`,
      status: "healthy",
    },
    {
      type: "repository",
      url: `https://github.com/example/${entry.name}`,
      status: "healthy",
    },
    {
      type: "docs",
      url: `https://docs.example.com/${entry.name}`,
      status: entry.indexing === "failed" ? "unreachable" : "healthy",
    },
  ]

  return (
    <BaseLayout
      title={entry.name}
      description={`${entry.ecosystem} · ${entry.version}`}
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <Badge variant={indexingVariant(entry.indexing)}>
              {entry.indexing}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {entry.documents} documents · {chunks.toLocaleString()} chunks ·{" "}
              {entry.freshness}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success(`Reindex queued for ${entry.name}`)
                }
              >
                Reindex
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => navigate(`/libraries/${entry.id}/edit`)}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="versions" className="w-full">
          <TabsList>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>
          <TabsContent value="versions" className="mt-4">
            <VersionsTable
              versions={libraryVersionsFixture}
              onReindex={(version) =>
                toast.success(`Reindex queued for ${version}`)
              }
            />
          </TabsContent>
          <TabsContent value="sources" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation sources</CardTitle>
                <CardDescription>
                  Where this library is fetched from.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.type}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {source.type}
                      </p>
                      <p className="text-muted-foreground truncate font-mono text-xs">
                        {source.url}
                      </p>
                    </div>
                    <Badge
                      variant={
                        source.status === "healthy" ? "default" : "destructive"
                      }
                    >
                      {source.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="knowledge" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge counts</CardTitle>
                <CardDescription>
                  Indexed content available for retrieval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Documents", String(entry.documents)],
                    ["Chunks", chunks.toLocaleString()],
                    ["Examples", String(examples)],
                    ["Snippets", String(snippets)],
                    ["Changelogs", String(libraryVersionsFixture.length)],
                  ].map(([term, value]) => (
                    <div
                      key={term}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <dt className="text-sm text-muted-foreground">{term}</dt>
                      <dd className="text-sm font-semibold tabular-nums">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  )
}
