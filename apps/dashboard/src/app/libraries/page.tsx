"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/base-layout";
import { libraryCorpusFixture } from "@/fixtures/libraries";
import { DataTable } from "./components/data-table";
import { StatCards } from "./components/stat-cards";

interface LibraryEntry {
  id: string;
  name: string;
  ecosystem: string;
  avatar: string;
  version: string;
  sources: number;
  indexing: string;
  freshness: string;
  documents: number;
}

export default function LibrariesPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LibraryEntry[]>(libraryCorpusFixture);

  const handleDeleteLibrary = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleEditLibrary = (entry: LibraryEntry) => {
    navigate(`/libraries/${entry.id}/edit`);
  };

  const ecosystems = new Set(entries.map((entry) => entry.ecosystem)).size;

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
              upToDate: entries.filter((entry) => entry.indexing === "indexed")
                .length,
              needsRefresh: entries.filter(
                (entry) =>
                  entry.indexing === "stale" || entry.indexing === "failed",
              ).length,
              documents: entries.reduce(
                (sum, entry) => sum + entry.documents,
                0,
              ),
            }}
          />
        </div>

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable
            entries={entries}
            onDeleteLibrary={handleDeleteLibrary}
            onEditLibrary={handleEditLibrary}
          />
        </div>
      </div>
    </BaseLayout>
  );
}
