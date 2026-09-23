"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { ImportModal } from "@/components/theme-customizer/import-modal"
import { LayoutTab } from "@/components/theme-customizer/layout-tab"
import { ThemeTab } from "@/components/theme-customizer/theme-tab"
import { tweakcnThemes } from "@/config/theme-data"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { useTheme } from "@/hooks/use-theme"
import { useThemeManager } from "@/hooks/use-theme-manager"
import {
  applyAppearance,
  loadAppearance,
  saveAppearance,
  type Appearance,
} from "@/lib/appearance"
import type { ImportedTheme } from "@/types/theme-customizer"

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
  const { updateConfig: updateSidebarConfig } = useSidebarConfig()
  const {
    applyImportedTheme,
    isDarkMode,
    resetTheme,
    applyRadius,
    setBrandColorsValues,
    applyTheme,
    applyTweakcnTheme,
  } = useThemeManager()

  const [selectedTheme, setSelectedTheme] = useState("default")
  const [selectedTweakcnTheme, setSelectedTweakcnTheme] = useState("")
  const [selectedRadius, setSelectedRadius] = useState("0.5rem")
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importedTheme, setImportedTheme] = useState<ImportedTheme | null>(null)

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: loadAppearance(),
  })

  function onSubmit(data: AppearanceFormValues) {
    const appearance: Appearance = { ...data }
    applyAppearance(appearance, setTheme)
    updateSidebarConfig({
      sidebarWidth: appearance.sidebarWidth,
      contentWidth: appearance.contentWidth,
    })
    saveAppearance(appearance)
    toast.success("Preferences saved")
  }

  function onCancel() {
    form.reset(loadAppearance())
  }

  function handleImport(themeData: ImportedTheme) {
    setImportedTheme(themeData)
    setSelectedTheme("")
    setSelectedTweakcnTheme("")
    applyImportedTheme(themeData, isDarkMode)
  }

  useEffect(() => {
    if (importedTheme) {
      applyImportedTheme(importedTheme, isDarkMode)
    } else if (selectedTheme) {
      applyTheme(selectedTheme, isDarkMode)
    } else if (selectedTweakcnTheme) {
      const selectedPreset = tweakcnThemes.find(
        (preset) => preset.value === selectedTweakcnTheme,
      )?.preset
      if (selectedPreset) {
        applyTweakcnTheme(selectedPreset, isDarkMode)
      }
    }
  }, [
    isDarkMode,
    importedTheme,
    selectedTheme,
    selectedTweakcnTheme,
    applyImportedTheme,
    applyTheme,
    applyTweakcnTheme,
  ])

  function handleResetTheme() {
    setSelectedTheme("default")
    setSelectedTweakcnTheme("")
    setSelectedRadius("0.5rem")
    setImportedTheme(null)
    setBrandColorsValues({})
    resetTheme()
    applyRadius("0.5rem")
    toast.success("Theme reset to defaults")
  }

  function handleResetLayout() {
    updateSidebarConfig({
      variant: "inset",
      collapsible: "offcanvas",
      side: "left",
    })
    toast.success("Layout reset to defaults")
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

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Theme mode, fonts, and content density.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Color presets, radius, and brand colors.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleResetTheme}
              aria-label="Reset theme"
              className="cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ThemeTab
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              selectedTweakcnTheme={selectedTweakcnTheme}
              setSelectedTweakcnTheme={setSelectedTweakcnTheme}
              selectedRadius={selectedRadius}
              setSelectedRadius={setSelectedRadius}
              setImportedTheme={setImportedTheme}
              onImportClick={() => setImportModalOpen(true)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Layout</CardTitle>
              <CardDescription>
                Sidebar variant, behavior, and position.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleResetLayout}
              aria-label="Reset layout"
              className="cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <LayoutTab />
          </CardContent>
        </Card>

        <ImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onImport={handleImport}
        />
      </div>
    </BaseLayout>
  )
}
