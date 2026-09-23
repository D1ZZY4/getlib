import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionActions } from "@/components/ui/section-actions"
import { ThemeTab } from "@/components/theme-customizer/theme-tab"
import {
  DEFAULT_THEME_CUSTOM,
  sameThemeCustom,
  type ThemeCustomState,
} from "@/lib/appearance"
import type { ImportedTheme } from "@/types/theme-customizer"

export function ThemeSection({
  selectedTheme,
  setSelectedTheme,
  selectedTweakcnTheme,
  setSelectedTweakcnTheme,
  selectedRadius,
  setSelectedRadius,
  setImportedTheme,
  imported,
  saved,
  onImportClick,
  onSave,
  onReset,
}: {
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  selectedTweakcnTheme: string
  setSelectedTweakcnTheme: (theme: string) => void
  selectedRadius: string
  setSelectedRadius: (radius: string) => void
  setImportedTheme: (theme: ImportedTheme | null) => void
  imported: ImportedTheme | null
  saved: ThemeCustomState
  onImportClick: () => void
  onSave: () => void
  onReset: () => void
}) {
  const current: ThemeCustomState = {
    preset: selectedTheme,
    tweakcn: selectedTweakcnTheme,
    radius: selectedRadius,
    imported,
  }
  const dirty = !sameThemeCustom(current, saved)
  const atDefaults = sameThemeCustom(current, DEFAULT_THEME_CUSTOM)
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Color presets, radius, and brand colors.
          </CardDescription>
        </div>
        <SectionActions
          saveLabel="Save Theme"
          onSave={onSave}
          disabled={!dirty}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={atDefaults}
            aria-label="Reset theme"
            className="cursor-pointer h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </SectionActions>
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
          onImportClick={onImportClick}
        />
      </CardContent>
    </Card>
  )
}
