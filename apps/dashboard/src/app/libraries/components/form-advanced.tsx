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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { LibraryFormValues } from "./library-form-schema";

export function AiRulesSection({
  form,
}: {
  form: UseFormReturn<LibraryFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Rules</CardTitle>
        <CardDescription>
          Guidance attached to this library for AI assistants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="aiRules"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Rules for AI assistants using this library..."
                  className="font-mono text-xs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export function AdvancedSection({
  form,
}: {
  form: UseFormReturn<LibraryFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced</CardTitle>
        <CardDescription>
          Redirect readers elsewhere, or block indexing entirely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="redirectUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Redirect{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Point this library at another one"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="blockIndexing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Block indexing</FormLabel>
                <CardDescription>
                  Hide this library and remove its content. Only metadata stays;
                  unblocking indexes it again.
                </CardDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
