import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LibraryFormValues } from "./library-form-schema";
import { StringListInput } from "./string-list";

export function SourcesSection({
  form,
}: {
  form: UseFormReturn<LibraryFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sources</CardTitle>
        <CardDescription>
          Folders and files included in or excluded from indexing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="includeFolders"
          render={({ field }) => (
            <FormItem>
              <StringListInput
                label="Folders to include"
                values={field.value}
                onChange={field.onChange}
                placeholder="docs"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excludeFolders"
          render={({ field }) => (
            <FormItem>
              <StringListInput
                label="Folders to exclude"
                values={field.value}
                onChange={field.onChange}
                placeholder="node_modules"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excludeFiles"
          render={({ field }) => (
            <FormItem>
              <StringListInput
                label="Files to exclude"
                values={field.value}
                onChange={field.onChange}
                placeholder="*.test.ts"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="urlsToExclude"
          render={({ field }) => (
            <FormItem>
              <StringListInput
                label="URLs to exclude"
                values={field.value}
                onChange={field.onChange}
                placeholder="https://example.com/internal"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="urlFragments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL fragments</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue placeholder="Select handling" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="drop">Drop (default)</SelectItem>
                    <SelectItem value="keep">Keep</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="queryParameters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query parameters</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue placeholder="Select handling" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="keep">Keep (default)</SelectItem>
                    <SelectItem value="drop">Drop</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
