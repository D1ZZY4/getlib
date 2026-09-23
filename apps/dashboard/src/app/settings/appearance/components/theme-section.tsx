import { ThemeTab } from "@/components/theme-customizer/theme-tab";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionActions } from "@/components/ui/section-actions";
import {
  DEFAULT_THEME_CUSTOM,
  sameThemeCustom,
  type ThemeCustomState,
  type ThemeMode,
} from "@/lib/appearance";
import type { ImportedTheme } from "@/types/theme-customizer";

export function ThemeSection({
  mode,
  onModeChange,
  selectedTheme,
  setSelectedTheme,
  selectedTweakcnTheme,
  setSelectedTweakcnTheme,
  selectedRadius,
  setSelectedRadius,
  setImportedTheme,
  imported,
  savedMode,
  saved,
  onImportClick,
  onSave,
  onCancel,
  onReset,
}: {
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  selectedTweakcnTheme: string;
  setSelectedTweakcnTheme: (theme: string) => void;
  selectedRadius: string;
  setSelectedRadius: (radius: string) => void;
  setImportedTheme: (theme: ImportedTheme | null) => void;
  imported: ImportedTheme | null;
  savedMode: ThemeMode;
  saved: ThemeCustomState;
  onImportClick: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}) {
  const current: ThemeCustomState = {
    preset: selectedTheme,
    tweakcn: selectedTweakcnTheme,
    radius: selectedRadius,
    imported,
  };
  const dirty = mode !== savedMode || !sameThemeCustom(current, saved);
  const atDefaults =
    mode === "system" && sameThemeCustom(current, DEFAULT_THEME_CUSTOM);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Mode, color presets, radius, and brand colors.
          </CardDescription>
        </div>
        <SectionActions
          saveLabel="Save Theme"
          onSave={onSave}
          saveDisabled={!dirty}
          onCancel={onCancel}
          cancelDisabled={!dirty}
          onReset={onReset}
          resetDisabled={atDefaults}
          resetLabel="Reset theme"
        />
      </CardHeader>
      <CardContent>
        <ThemeTab
          mode={mode}
          onModeChange={onModeChange}
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
  );
}
