import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionActions } from "@/components/ui/section-actions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemePreview } from "./theme-preview"
import type { AppearanceFormValues } from "@/lib/appearance"

export function PreferencesSection({
  form,
  onSubmit,
  onCancel,
}: {
  form: UseFormReturn<AppearanceFormValues>
  onSubmit: (data: AppearanceFormValues) => void
  onCancel: () => void
}) {
  const {
    formState: { isDirty },
  } = form
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Theme mode, fonts, and content density.
          </CardDescription>
        </div>
        <SectionActions
          saveLabel="Save Preferences"
          submitFormId="preferences-form"
          disabled={!isDirty}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={!isDirty}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </SectionActions>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="preferences-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium mb-2">Theme</h3>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      {(["light", "dark", "system"] as const).map((value) => (
                        <FormItem key={value}>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value={value} className="sr-only" />
                            </FormControl>
                            <ThemePreview variant={value} />
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Family</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
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
                      <SelectTrigger className="cursor-pointer">
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
                      <SelectTrigger className="cursor-pointer">
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
                      <SelectTrigger className="cursor-pointer">
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

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
