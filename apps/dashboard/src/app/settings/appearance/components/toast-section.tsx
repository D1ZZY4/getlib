import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SectionActions } from "@/components/ui/section-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_TOAST,
  sameToast,
  type ToastPosition,
  type ToastSettings,
} from "@/lib/appearance";

const POSITIONS: { value: ToastPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
];

const VISIBLE_OPTIONS = [1, 2, 3, 4, 5];

export function ToastSection({
  toast,
  onToastChange,
  saved,
  onSave,
  onCancel,
  onReset,
}: {
  toast: ToastSettings;
  onToastChange: (toast: ToastSettings) => void;
  saved: ToastSettings;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}) {
  const dirty = !sameToast(toast, saved);
  const atDefaults = sameToast(toast, DEFAULT_TOAST);
  const set = (patch: Partial<ToastSettings>) =>
    onToastChange({ ...toast, ...patch });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Position, timing, stacking, shape, and behavior.
          </CardDescription>
        </div>
        <SectionActions
          saveLabel="Save Toast"
          onSave={onSave}
          saveDisabled={!dirty}
          onCancel={onCancel}
          cancelDisabled={!dirty}
          onReset={onReset}
          resetDisabled={atDefaults}
          resetLabel="Reset toast"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Position</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {POSITIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => set({ position: option.value })}
                aria-pressed={toast.position === option.value}
                aria-label={`Toast position ${option.label}`}
                className={`rounded-md border p-2 text-xs font-medium transition-colors cursor-pointer ${
                  toast.position === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/60"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="toast-duration" className="text-sm font-medium">
                Auto-dismiss
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {(toast.durationMs / 1000).toFixed(0)}s
              </span>
            </div>
            <input
              id="toast-duration"
              type="range"
              min={1000}
              max={15000}
              step={1000}
              value={toast.durationMs}
              onChange={(event) =>
                set({ durationMs: Number(event.target.value) })
              }
              className="w-full cursor-pointer accent-primary"
              aria-label="Toast duration"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="toast-radius" className="text-sm font-medium">
                Corner radius
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {toast.radiusPx}px
              </span>
            </div>
            <input
              id="toast-radius"
              type="range"
              min={0}
              max={24}
              step={2}
              value={toast.radiusPx}
              onChange={(event) =>
                set({ radiusPx: Number(event.target.value) })
              }
              className="w-full cursor-pointer accent-primary"
              aria-label="Toast radius"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="toast-visible" className="text-sm font-medium">
              Stacked toasts
            </Label>
            <Select
              value={String(toast.visibleToasts)}
              onValueChange={(value) => set({ visibleToasts: Number(value) })}
            >
              <SelectTrigger
                id="toast-visible"
                className="cursor-pointer w-full"
                aria-label="Visible toasts"
              >
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {VISIBLE_OPTIONS.map((count) => (
                  <SelectItem key={count} value={String(count)}>
                    {count} at a time
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-6 pb-1">
            <div className="flex items-center gap-2">
              <Switch
                id="toast-expanded"
                checked={toast.expanded}
                onCheckedChange={(checked) => set({ expanded: checked })}
                aria-label="Expand toasts"
              />
              <Label htmlFor="toast-expanded" className="text-sm">
                Expanded
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="toast-close-button"
                checked={toast.closeButton}
                onCheckedChange={(checked) => set({ closeButton: checked })}
                aria-label="Close button"
              />
              <Label htmlFor="toast-close-button" className="text-sm">
                Close button
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
