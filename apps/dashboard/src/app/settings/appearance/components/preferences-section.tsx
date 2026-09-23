import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SectionActions } from "@/components/ui/section-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppearanceFormValues } from "@/lib/appearance";

export function PreferencesSection({
  form,
  onSubmit,
  onCancel,
  onReset,
  dirty,
  atDefaults,
}: {
  form: UseFormReturn<AppearanceFormValues>;
  onSubmit: (data: AppearanceFormValues) => void;
  onCancel: () => void;
  onReset: () => void;
  dirty: boolean;
  atDefaults: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Fonts and content density.</CardDescription>
        </div>
        <SectionActions
          saveLabel="Save Preferences"
          submitFormId="preferences-form"
          saveDisabled={!dirty}
          onCancel={onCancel}
          cancelDisabled={!dirty}
          onReset={onReset}
          resetDisabled={atDefaults}
          resetLabel="Reset preferences"
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="preferences-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fontFamily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="cursor-pointer"
                          aria-label="Font family"
                        >
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="cursor-pointer"
                          aria-label="Font size"
                        >
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sidebarWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sidebar Width</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="cursor-pointer"
                          aria-label="Sidebar width"
                        >
                          <SelectValue placeholder="Select sidebar width" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Width</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="cursor-pointer"
                          aria-label="Content width"
                        >
                          <SelectValue placeholder="Select content width" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="fluid">Fluid</SelectItem>
                        <SelectItem value="container">Container</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
