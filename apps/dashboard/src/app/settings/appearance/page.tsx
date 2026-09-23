"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { BaseLayout } from "@/components/layouts/base-layout"
import { ImportModal } from "@/components/theme-customizer/import-modal"
import { tweakcnThemes } from "@/config/theme-data"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { useTheme } from "@/hooks/use-theme"
import { useThemeManager } from "@/hooks/use-theme-manager"
import {
  applyAppearance,
  appearanceFormSchema,
  DEFAULT_APPEARANCE,
  loadAppearance,
  loadSnapshot,
  saveAppearance,
  saveLayout,
  saveSnapshot,
  saveThemeCustom,
  type Appearance,
} from "@/lib/appearance"
import type { ImportedTheme } from "@/types/theme-customizer"
import { LayoutSection } from "./components/layout-section"
import { PreferencesSection } from "./components/preferences-section"
import type { AppearanceFormValues, ThemeMode } from "@/lib/appearance"
import { ThemeSection } from "./components/theme-section"

export default function AppearanceSettings() {
  const { theme: providerTheme, setTheme } = useTheme()
  const { config: sidebarConfig, updateConfig: updateSidebarConfig } =
    useSidebarConfig()
  const {
    applyImportedTheme,
    isDarkMode,
    resetTheme,
    applyRadius,
    setBrandColorsValues,
    applyTheme,
    applyTweakcnTheme,
  } = useThemeManager()

  const [selectedTheme, setSelectedTheme] = useState(
    () => loadSnapshot().themeCustom.preset,
  )
  const [selectedTweakcnTheme, setSelectedTweakcnTheme] = useState(
    () => loadSnapshot().themeCustom.tweakcn,
  )
  const [selectedRadius, setSelectedRadius] = useState(
    () => loadSnapshot().themeCustom.radius,
  )
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importedTheme, setImportedTheme] = useState<ImportedTheme | null>(
    () => loadSnapshot().themeCustom.imported,
  )
  const [savedThemeCustom, setSavedThemeCustom] = useState(
    () => loadSnapshot().themeCustom,
  )
  const [savedLayout, setSavedLayout] = useState(
    () => loadSnapshot().layout,
  )
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    () => loadSnapshot().theme,
  )
  const [savedThemeMode, setSavedThemeMode] = useState<ThemeMode>(
    () => loadSnapshot().theme,
  )

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: loadAppearance(),
  })

  // Provider theme is the live truth. If it changes from outside this
  // page (e.g. the header sun/moon button), mirror it into the draft so
  // the selected card highlight stays realtime and never drifts.
  // Adjusted during render (not in an effect) and skipping the initial
  // mount so a saved snapshot always wins on first paint.
  const [prevProviderTheme, setPrevProviderTheme] = useState(providerTheme)
  const [providerSynced, setProviderSynced] = useState(false)
  if (providerTheme !== prevProviderTheme) {
    setPrevProviderTheme(providerTheme)
    if (providerSynced) {
      setThemeMode(providerTheme)
    }
    setProviderSynced(true)
  }

  // Re-apply the saved theme customization on load (theme engine itself
  // keeps everything in memory, so a reload would otherwise lose it).
  const appliedSavedTheme = useRef(false)
  useEffect(() => {
    if (appliedSavedTheme.current) return
    appliedSavedTheme.current = true
    const saved = loadSnapshot().themeCustom
    if (saved.imported) {
      applyImportedTheme(saved.imported, isDarkMode)
    } else if (saved.tweakcn) {
      const preset = tweakcnThemes.find((t) => t.value === saved.tweakcn)?.preset
      if (preset) applyTweakcnTheme(preset, isDarkMode)
    } else if (saved.preset && saved.preset !== "default") {
      applyTheme(saved.preset, isDarkMode)
    }
    if (saved.radius !== "0.5rem") applyRadius(saved.radius)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(data: AppearanceFormValues) {
    const appearance: Appearance = { ...data, theme: themeMode }
    applyAppearance(appearance, setTheme)
    updateSidebarConfig({
      sidebarWidth: appearance.sidebarWidth,
      contentWidth: appearance.contentWidth,
    })
    saveAppearance(appearance)
    form.reset(data)
    toast.success("Preferences saved")
  }

  function onCancel() {
    form.reset(loadAppearance())
  }

  function isPreferencesDefaults(values: AppearanceFormValues): boolean {
    return (
      values.fontFamily === DEFAULT_APPEARANCE.fontFamily &&
      values.fontSize === DEFAULT_APPEARANCE.fontSize &&
      values.sidebarWidth === DEFAULT_APPEARANCE.sidebarWidth &&
      values.contentWidth === DEFAULT_APPEARANCE.contentWidth
    )
  }
  function handleResetPreferences() {
    const defaults = { ...DEFAULT_APPEARANCE, theme: themeMode }
    form.reset(defaults)
    applyAppearance(defaults, setTheme)
    updateSidebarConfig({
      sidebarWidth: defaults.sidebarWidth,
      contentWidth: defaults.contentWidth,
    })
    saveAppearance(defaults)
    toast.success("Preferences reset to defaults")
  }

  function handleThemeModeChange(mode: ThemeMode) {
    // Draft only — ThemeTab applies the live provider theme inside the
    // circular transition, so this never double-sets or tears.
    setThemeMode(mode)
  }

  function applySavedThemeCustom(
    saved: typeof savedThemeCustom,
    darkMode: boolean,
  ) {
    if (saved.imported) {
      applyImportedTheme(saved.imported, darkMode)
    } else if (saved.tweakcn) {
      const preset = tweakcnThemes.find((t) => t.value === saved.tweakcn)?.preset
      if (preset) applyTweakcnTheme(preset, darkMode)
    } else if (saved.preset && saved.preset !== "default") {
      applyTheme(saved.preset, darkMode)
    }
    applyRadius(saved.radius)
  }

  function handleImport(themeData: ImportedTheme) {
    setImportedTheme(themeData)
    setSelectedTheme("")
    setSelectedTweakcnTheme("")
    applyImportedTheme(themeData, isDarkMode)
  }

  function handleResetTheme() {
    setSelectedTheme("default")
    setSelectedTweakcnTheme("")
    setSelectedRadius("0.5rem")
    setImportedTheme(null)
    setBrandColorsValues({})
    resetTheme()
    applyRadius("0.5rem")
    saveThemeCustom({
      preset: "default",
      tweakcn: "",
      radius: "0.5rem",
      imported: null,
    })
    toast.success("Theme reset to defaults")
  }

  function handleSaveTheme() {
    const themeCustom = {
      preset: selectedTheme,
      tweakcn: selectedTweakcnTheme,
      radius: selectedRadius,
      imported: importedTheme,
    }
    saveThemeCustom(themeCustom)
    setSavedThemeCustom(themeCustom)
    setSavedThemeMode(themeMode)
    const snapshot = loadSnapshot()
    saveSnapshot({ ...snapshot, theme: themeMode })
    toast.success("Theme saved")
  }

  function handleCancelTheme() {
    setThemeMode(savedThemeMode)
    setTheme(savedThemeMode)
    setSelectedTheme(savedThemeCustom.preset)
    setSelectedTweakcnTheme(savedThemeCustom.tweakcn)
    setSelectedRadius(savedThemeCustom.radius)
    setImportedTheme(savedThemeCustom.imported)
    applySavedThemeCustom(savedThemeCustom, isDarkMode)
  }

  function handleResetLayout() {
    updateSidebarConfig({
      variant: "inset",
      collapsible: "offcanvas",
      side: "left",
    })
    saveLayout({
      variant: "inset",
      collapsible: "offcanvas",
      side: "left",
    })
    toast.success("Layout reset to defaults")
  }

  function handleCancelLayout() {
    updateSidebarConfig(savedLayout)
  }

  function handleSaveLayout() {
    const layout = {
      variant: sidebarConfig.variant,
      collapsible: sidebarConfig.collapsible,
      side: sidebarConfig.side,
    }
    saveLayout(layout)
    setSavedLayout(layout)
    toast.success("Layout saved")
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

        <PreferencesSection
          form={form}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onReset={handleResetPreferences}
          dirty={form.formState.isDirty}
          atDefaults={isPreferencesDefaults(form.getValues())}
        />

        <ThemeSection
          mode={themeMode}
          onModeChange={handleThemeModeChange}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          selectedTweakcnTheme={selectedTweakcnTheme}
          setSelectedTweakcnTheme={setSelectedTweakcnTheme}
          selectedRadius={selectedRadius}
          setSelectedRadius={setSelectedRadius}
          setImportedTheme={setImportedTheme}
          imported={importedTheme}
          savedMode={savedThemeMode}
          saved={savedThemeCustom}
          onImportClick={() => setImportModalOpen(true)}
          onSave={handleSaveTheme}
          onCancel={handleCancelTheme}
          onReset={handleResetTheme}
        />

        <LayoutSection
          current={{
            variant: sidebarConfig.variant,
            collapsible: sidebarConfig.collapsible,
            side: sidebarConfig.side,
          }}
          saved={savedLayout}
          onSave={handleSaveLayout}
          onCancel={handleCancelLayout}
          onReset={handleResetLayout}
        />

        <ImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onImport={handleImport}
        />
      </div>
    </BaseLayout>
  )
}
