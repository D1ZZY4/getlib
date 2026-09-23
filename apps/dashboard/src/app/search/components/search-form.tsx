import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export function SearchForm({
  draft,
  onDraftChange,
  library,
  onLibraryChange,
  version,
  onVersionChange,
  source,
  onSourceChange,
  limit,
  onLimitChange,
  onSubmit,
}: {
  draft: string
  onDraftChange: (value: string) => void
  library: string
  onLibraryChange: (value: string) => void
  version: string
  onVersionChange: (value: string) => void
  source: string
  onSourceChange: (value: string) => void
  limit: string
  onLimitChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 md:flex-row md:items-center"
    >
      <Input
        placeholder="Search libraries, documentation, sections..."
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        className="md:max-w-md"
        aria-label="Search query"
      />
      <Select value={library} onValueChange={onLibraryChange}>
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
        onChange={(event) => onVersionChange(event.target.value)}
        className="md:w-40"
        aria-label="Filter by version"
      />
      <Select value={source} onValueChange={onSourceChange}>
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
      <Select value={limit} onValueChange={onLimitChange}>
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
  )
}
