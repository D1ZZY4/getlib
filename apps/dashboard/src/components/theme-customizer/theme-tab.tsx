"use client";

import {
  ExternalLink,
  Monitor,
  Moon,
  Palette,
  Sun,
  Upload,
} from "lucide-react";
import type React from "react";
import { ColorPicker } from "@/components/color-picker";
import { ThemePreview } from "@/components/theme-preview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { baseColors } from "@/config/theme-customizer-constants";
import { colorThemes, tweakcnThemes } from "@/config/theme-data";
import { useCircularTransition } from "@/hooks/use-circular-transition";
import { useTheme } from "@/hooks/use-theme";
import { useThemeManager } from "@/hooks/use-theme-manager";
import type { ThemeMode } from "@/lib/appearance";
import { radiusPercentToRem, radiusRemToPercent } from "@/lib/appearance";
import type { ImportedTheme } from "@/types/theme-customizer";
import { PresetSelect } from "./preset-select";
import "./circular-transition.css";

interface ThemeTabProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  selectedTweakcnTheme: string;
  setSelectedTweakcnTheme: (theme: string) => void;
  selectedRadius: string;
  setSelectedRadius: (radius: string) => void;
  setImportedTheme: (theme: ImportedTheme | null) => void;
  onImportClick: () => void;
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

export function ThemeTab({
  selectedTheme,
  setSelectedTheme,
  selectedTweakcnTheme,
  setSelectedTweakcnTheme,
  selectedRadius,
  setSelectedRadius,
  setImportedTheme,
  onImportClick,
  mode,
  onModeChange,
}: ThemeTabProps) {
  const {
    isDarkMode,
    brandColorsValues,
    setBrandColorsValues,
    applyTheme,
    applyTweakcnTheme,
    applyRadius,
    handleColorChange,
  } = useThemeManager();

  const { setTheme } = useTheme();
  const { startTransition } = useCircularTransition();

  const handleRandomShadcn = () => {
    // Apply a random shadcn theme
    const randomTheme =
      colorThemes[Math.floor(Math.random() * colorThemes.length)];
    setSelectedTheme(randomTheme.value);
    setSelectedTweakcnTheme(""); // Clear tweakcn selection
    setBrandColorsValues({}); // Clear brand colors state
    setImportedTheme(null); // Clear imported theme
    applyTheme(randomTheme.value, isDarkMode);
  };

  const handleRandomTweakcn = () => {
    // Apply a random tweakcn theme
    const randomTheme =
      tweakcnThemes[Math.floor(Math.random() * tweakcnThemes.length)];
    setSelectedTweakcnTheme(randomTheme.value);
    setSelectedTheme(""); // Clear shadcn selection
    setBrandColorsValues({}); // Clear brand colors state
    setImportedTheme(null); // Clear imported theme
    applyTweakcnTheme(randomTheme.preset, isDarkMode);
  };

  const handleRadiusInput = (percent: number) => {
    const next = radiusPercentToRem(percent);
    setSelectedRadius(next);
    applyRadius(next);
  };

  const radiusPercent = radiusRemToPercent(selectedRadius);

  const handleModeSelect = (
    event: React.MouseEvent<HTMLButtonElement>,
    target: ThemeMode,
  ) => {
    if (target === mode) return;
    onModeChange(target);
    const coords = { x: event.clientX, y: event.clientY };
    startTransition(coords, () => {
      setTheme(target);
    });
  };

  return (
    <div className="p-4 space-y-6">
      <PresetSelect
        title="Shadcn UI Theme Presets"
        placeholder="Choose Shadcn Theme"
        value={selectedTheme}
        themes={colorThemes}
        onRandom={handleRandomShadcn}
        onChange={(value) => {
          setSelectedTheme(value);
          setSelectedTweakcnTheme(""); // Clear tweakcn selection
          setBrandColorsValues({}); // Clear brand colors state
          setImportedTheme(null); // Clear imported theme
          applyTheme(value, isDarkMode);
        }}
      />

      <Separator />

      <PresetSelect
        title="Tweakcn Theme Presets"
        placeholder="Choose Tweakcn Theme"
        value={selectedTweakcnTheme}
        themes={tweakcnThemes}
        onRandom={handleRandomTweakcn}
        onChange={(value) => {
          setSelectedTweakcnTheme(value);
          setSelectedTheme(""); // Clear shadcn selection
          setBrandColorsValues({}); // Clear brand colors state
          setImportedTheme(null); // Clear imported theme
          const selectedPreset = tweakcnThemes.find(
            (t) => t.value === value,
          )?.preset;
          if (selectedPreset) {
            applyTweakcnTheme(selectedPreset, isDarkMode);
          }
        }}
      />

      <Separator />

      {/* Radius Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="radius-slider" className="text-sm font-medium">
            Radius
          </Label>
          <span
            className="text-xs text-muted-foreground tabular-nums"
            aria-live="polite"
          >
            {radiusPercent}% · {selectedRadius}
          </span>
        </div>
        <input
          id="radius-slider"
          type="range"
          min={0}
          max={100}
          step={10}
          value={radiusPercent}
          onChange={(event) => handleRadiusInput(Number(event.target.value))}
          className="w-full cursor-pointer accent-primary"
          aria-describedby={
            radiusPercent === 60 ? "radius-macos-hint" : undefined
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Sharp</span>
          <span>Round</span>
        </div>
        {radiusPercent === 60 ? (
          <p id="radius-macos-hint" className="text-xs text-muted-foreground">
            60% - smooth like macOS.
          </p>
        ) : null}
      </div>

      <Separator />

      {/* Mode Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Mode</Label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { value: "light", label: "Light", Icon: Sun },
              { value: "dark", label: "Dark", Icon: Moon },
              { value: "system", label: "System", Icon: Monitor },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={(event) => handleModeSelect(event, value)}
              aria-pressed={mode === value}
              aria-label={`Theme mode ${label}`}
              className={`flex flex-col items-center gap-2 rounded-md border p-3 transition-colors cursor-pointer ${
                mode === value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-border/60"
              }`}
            >
              <ThemePreview variant={value} />
              <span className="flex items-center gap-1 text-xs font-medium">
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Import Theme Button */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onImportClick}
          className="w-full cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          Import Theme
        </Button>
      </div>

      {/* Brand Colors Section */}
      <Accordion
        type="single"
        collapsible
        className="w-full border-b rounded-lg"
      >
        <AccordionItem
          value="brand-colors"
          className="border border-border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-medium cursor-pointer">
              Brand Colors
            </Label>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-3 border-t border-border bg-muted/20">
            {baseColors.map((color) => (
              <div
                key={color.cssVar}
                className="flex items-center justify-between"
              >
                <ColorPicker
                  label={color.name}
                  cssVar={color.cssVar}
                  value={brandColorsValues[color.cssVar] || ""}
                  onChange={handleColorChange}
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tweakcn */}
      <div className="p-4 bg-muted rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Advanced Customization</span>
        </div>
        <p className="text-xs text-muted-foreground">
          For advanced theme customization with real-time preview, visual color
          picker, and hundreds of prebuilt themes, visit{" "}
          <a
            href="https://tweakcn.com/editor/theme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            tweakcn.com
          </a>
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer"
          onClick={() =>
            window.open("https://tweakcn.com/editor/theme", "_blank")
          }
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Open Tweakcn
        </Button>
      </div>
    </div>
  );
}
