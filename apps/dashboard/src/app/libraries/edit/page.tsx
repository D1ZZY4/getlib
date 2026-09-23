"use client"

import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { BaseLayout } from "@/components/layouts/base-layout"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LibraryForm } from "../components/library-form"
import type { LibraryFormValues } from "../components/library-form-schema"
import { VersionsTable } from "../components/versions-table"
import { libraryVersionsFixture } from "@/fixtures/libraries"
import initialLibrariesData from "../data.json"

function initialValuesFor(id: string | undefined): LibraryFormValues | null {
  const entry = initialLibrariesData.find((item) => item.id === id)
  if (!entry) return null
  return {
    name: entry.name,
    ecosystem: entry.ecosystem as LibraryFormValues["ecosystem"],
    version: entry.version,
    repositoryUrl: `https://github.com/example/${entry.name}`,
    branch: "main",
    description: "",
    baseUrl: `https://docs.example.com/${entry.name}`,
    displayUrl: "",
    versionDetection: "all",
    includeFolders: ["docs"],
    excludeFolders: ["node_modules", "dist"],
    excludeFiles: [],
    urlsToExclude: [],
    urlFragments: "drop",
    queryParameters: "keep",
    aiRules: "",
    redirectUrl: "",
    blockIndexing: false,
  }
}

export default function EditLibraryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const initialValues = initialValuesFor(id)

  function handleSubmit(data: LibraryFormValues) {
    toast.success(`Library ${data.name} updated`)
    navigate("/libraries")
  }

  function handleReindex(version: string) {
    toast.success(`Reindex queued for ${version}`)
  }

  if (!initialValues) {
    return (
      <BaseLayout
        title="Edit Library"
        description="Update library sources and indexing rules"
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

  return (
    <BaseLayout
      title="Edit Library"
      description="Update library sources and indexing rules"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <LibraryForm
          defaultValues={initialValues}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/libraries")}
        />
        <VersionsTable
          versions={libraryVersionsFixture}
          onReindex={handleReindex}
        />
      </div>
    </BaseLayout>
  )
}
