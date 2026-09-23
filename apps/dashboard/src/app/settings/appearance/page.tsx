"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
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
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { useTheme } from "@/hooks/use-theme"
import {
  applyAppearance,
  loadAppearance,
  saveAppearance,
  type Appearance,
} from "@/lib/appearance"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontFamily: z.enum(["inter", "system", "mono"]),
  fontSize: z.enum(["small", "medium", "large"]),
  sidebarWidth: z.enum(["compact", "comfortable", "spacious"]),
  contentWidth: z.enum(["fixed", "fluid", "container"]),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

function ThemePreview({ variant }: { variant: "light" | "dark" | "system" }) {
  if (variant === "system") {
    return (
      <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
        <div className="flex space-x-2">
          <div className="w-10 h-20 bg-white border rounded-md" />
          <div className="w-10 h-20 bg-gray-900 border border-gray-700 rounded-md" />
        </div>
        <span className="text-sm font-medium">System</span>
      </div>
    )
  }
  const dark = variant === "dark"
  return (
    <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
      <div className="space-y-2">
        <div
          className={
            dark
              ? "w-20 h-20 bg-gray-900 border border-gray-700 rounded-md p-3"
              : "w-20 h-20 bg-white border rounded-md p-3"
          }
        >
          <div className="space-y-2">
            <div
              className={
                dark
                  ? "h-2 bg-gray-600 rounded w-3/4"
                  : "h-2 bg-gray-200 rounded w-3/4"
              }
            ></div>
            <div
              className={
                dark
                  ? "h-2 bg-gray-600 rounded w-1/2"
                  : "h-2 bg-gray-200 rounded w-1/2"
              }
            ></div>
            <div className="flex space-x-2">
              <div
                className={
                  dark
                    ? "h-2 w-2 bg-gray-500 rounded-full"
                    : "h-2 w-2 bg-gray-300 rounded-full"
                }
              ></div>
              <div
                className={
                  dark ? "h-2 bg-gray-600 rounded flex-1" : "h-2 bg-gray-200 rounded flex-1"
                }
              ></div>
            </div>
            <div className="flex space-x-2">
              <div
                className={
                  dark
                    ? "h-2 w-2 bg-gray-500 rounded-full"
                    : "h-2 w-2 bg-gray-300 rounded-full"
                }
              ></div>
              <div
                className={
                  dark ? "h-2 bg-gray-600 rounded flex-1" : "h-2 bg-gray-200 rounded flex-1"
                }
              ></div>
            </div>
          </div>
        </div>
        <span className="text-sm font-medium">
          {dark ? "Dark" : "Light"}
        </span>
      </div>
    </div>
  )
}

export default function AppearanceSettings() {
  const { setTheme } = useTheme()
  const { updateConfig } = useSidebarConfig()
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: loadAppearance(),
  })

  function onSubmit(data: AppearanceFormValues) {
    const appearance: Appearance = { ...data }
    applyAppearance(appearance, setTheme)
    updateConfig({
      sidebarWidth: appearance.sidebarWidth,
      contentWidth: appearance.contentWidth,
    })
    saveAppearance(appearance)
    toast.success("Preferences saved")
  }

  function onCancel() {
    form.reset(loadAppearance())
  }

  return (
    <BaseLayout>
      <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Appearance</h1>
          <p className="text-muted-foreground">
            Customize the appearance of the application.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Theme Section */}
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

            {/* Layout Section */}
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

            <div className="flex space-x-2 mt-12">
              <Button type="submit" className="cursor-pointer">
                Save Preferences
              </Button>
              <Button variant="outline" type="button" className="cursor-pointer" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </BaseLayout>
  )
}
