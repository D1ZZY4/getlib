"use client"

import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"

import initialLibrariesData from "./data.json"

interface LibraryEntry {
  id: string
  name: string
  ecosystem: string
  avatar: string
  version: string
  sources: number
  indexing: string
  freshness: string
  documents: number
}

interface LibraryFormValues {
  name: string
  ecosystem: string
  version: string
  sourceUrl: string
}

export default function LibrariesPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>(initialLibrariesData)

  const generateAvatar = (name: string) => {
    const clean = name.replace(/^@/, "")
    const parts = clean.split(/[/\s-]+/)
    if (parts.length >= 2) {
      return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
    }
    return clean.substring(0, 2).toUpperCase()
  }

  const handleAddLibrary = (data: LibraryFormValues) => {
    const newEntry: LibraryEntry = {
      id: `lib-${Date.now()}`,
      name: data.name,
      ecosystem: data.ecosystem,
      avatar: generateAvatar(data.name),
      version: data.version,
      sources: 1,
      indexing: "indexing",
      freshness: "just now",
      documents: 0,
    }
    setEntries(prev => [newEntry, ...prev])
  }

  const handleDeleteLibrary = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const handleEditLibrary = (entry: LibraryEntry) => {
    // For now, just log the entry to edit
    // In a real app, you'd open an edit dialog
    console.log("Edit library:", entry)
  }

  const ecosystems = new Set(entries.map(entry => entry.ecosystem)).size

  return (
    <BaseLayout
      title="Libraries"
      description="Registered libraries, versions, and indexing state"
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <StatCards
            stats={{
              total: entries.length,
              ecosystems,
              upToDate: entries.filter(entry => entry.indexing === "indexed").length,
              needsRefresh: entries.filter(
                entry => entry.indexing === "stale" || entry.indexing === "failed",
              ).length,
              documents: entries.reduce((sum, entry) => sum + entry.documents, 0),
            }}
          />
        </div>

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable
            entries={entries}
            onDeleteLibrary={handleDeleteLibrary}
            onEditLibrary={handleEditLibrary}
            onAddLibrary={handleAddLibrary}
          />
        </div>
      </div>
    </BaseLayout>
  )
}
