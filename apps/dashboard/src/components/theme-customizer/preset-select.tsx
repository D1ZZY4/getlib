"use client";

import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColorTheme } from "@/types/theme-customizer";

const SWATCH_KEYS = ["primary", "secondary", "accent", "muted"] as const;

function ThemeSwatches({ preset }: { preset: ColorTheme["preset"] }) {
  return (
    <div className="flex gap-1">
      {SWATCH_KEYS.map((key) => (
        <div
          key={key}
          className="w-3 h-3 rounded-full border border-border/20"
          style={{ backgroundColor: preset.styles.light[key] }}
        />
      ))}
    </div>
  );
}

export function PresetSelect({
  title,
  placeholder,
  value,
  themes,
  onRandom,
  onChange,
}: {
  title: string;
  placeholder: string;
  value: string;
  themes: ColorTheme[];
  onRandom: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{title}</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={onRandom}
          className="cursor-pointer"
        >
          <Dices className="h-3.5 w-3.5 mr-1.5" />
          Random
        </Button>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          <div className="p-2">
            {themes.map((theme) => (
              <SelectItem
                key={theme.value}
                value={theme.value}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ThemeSwatches preset={theme.preset} />
                  <span>{theme.name}</span>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
