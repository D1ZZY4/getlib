import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIBRARY_OPTIONS = [
  "all",
  "react",
  "@tanstack/react-query",
  "zod",
  "hono",
  "drizzle-orm",
  "typescript",
  "vite",
];

const SOURCE_OPTIONS = ["all", "npm", "github"];

const LIMIT_OPTIONS = ["5", "10", "25"];

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
  draft: string;
  onDraftChange: (value: string) => void;
  library: string;
  onLibraryChange: (value: string) => void;
  version: string;
  onVersionChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  limit: string;
  onLimitChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center"
    >
      <Input
        placeholder="Search libraries and knowledge..."
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        className="lg:min-w-64 lg:flex-1"
        aria-label="Search query"
      />
      <Select value={library} onValueChange={onLibraryChange}>
        <SelectTrigger className="lg:w-52" aria-label="Filter by library">
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
        placeholder="Version"
        value={version}
        onChange={(event) => onVersionChange(event.target.value)}
        className="lg:w-36"
        aria-label="Filter by version"
      />
      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className="lg:w-36" aria-label="Filter by source">
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
        <SelectTrigger className="lg:w-24" aria-label="Result limit">
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
  );
}
