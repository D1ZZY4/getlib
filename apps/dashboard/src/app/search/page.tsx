"use client";

import { useMemo, useState } from "react";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { libraryCorpusFixture, trustForLibrary } from "@/fixtures/libraries";
import { useSearchQuery } from "@/hooks/use-search";
import { KnowledgeResults } from "./components/knowledge-results";
import { LibraryResults } from "./components/library-results";
import { SearchForm } from "./components/search-form";

export default function SearchPage() {
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [library, setLibrary] = useState("all");
  const [version, setVersion] = useState("");
  const [source, setSource] = useState("all");
  const [limit, setLimit] = useState("10");

  const parsedLimit = Number.parseInt(limit, 10);
  const safeLimit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 50)
      : 10;

  const search = useSearchQuery(submitted, {
    library,
    version,
    source,
    limit: safeLimit,
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(draft);
  };

  const matchedLibraries = useMemo(() => {
    const needle = submitted.trim().toLowerCase();
    return libraryCorpusFixture.filter((entry) => {
      if (library !== "all" && entry.name !== library) return false;
      if (needle.length === 0) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.ecosystem.toLowerCase().includes(needle)
      );
    });
  }, [submitted, library]);

  const totalDocuments = useMemo(
    () => libraryCorpusFixture.reduce((sum, entry) => sum + entry.documents, 0),
    [],
  );

  return (
    <BaseLayout
      title="Search"
      description="Explore libraries and version-aware knowledge with provenance"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <SearchForm
              draft={draft}
              onDraftChange={setDraft}
              library={library}
              onLibraryChange={setLibrary}
              version={version}
              onVersionChange={setVersion}
              source={source}
              onSourceChange={setSource}
              limit={limit}
              onLimitChange={setLimit}
              onSubmit={submit}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="libraries" className="w-full">
          <TabsList>
            <TabsTrigger value="libraries">Libraries</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>

          <TabsContent value="libraries" className="mt-4">
            <LibraryResults
              entries={matchedLibraries}
              totalLibraries={libraryCorpusFixture.length}
              totalDocuments={totalDocuments}
              trustFor={trustForLibrary}
            />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-4">
            <KnowledgeResults submitted={submitted} search={search} />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
