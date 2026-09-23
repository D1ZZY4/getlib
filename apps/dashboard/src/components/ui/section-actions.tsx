import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Shared action row for settings section cards.
 *
 * Every section shows the same three actions: Save, Cancel, and
 * reset-to-defaults. Actions disable themselves when they would be
 * no-ops: Save and Cancel while the section has no unsaved changes,
 * Reset while the section already matches factory defaults.
 */
export function SectionActions({
  saveLabel,
  saveDisabled,
  onSave,
  submitFormId,
  onCancel,
  cancelDisabled,
  onReset,
  resetDisabled,
  resetLabel,
}: {
  saveLabel: string
  saveDisabled?: boolean
  onSave?: () => void
  submitFormId?: string
  onCancel: () => void
  cancelDisabled?: boolean
  onReset: () => void
  resetDisabled?: boolean
  resetLabel: string
}) {
  return (
    <div className="ml-auto flex items-center gap-2">
      {submitFormId ? (
        <Button
          type="submit"
          form={submitFormId}
          variant="outline"
          size="sm"
          disabled={saveDisabled}
          className="cursor-pointer"
        >
          {saveLabel}
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saveDisabled}
          className="cursor-pointer"
        >
          {saveLabel}
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        disabled={cancelDisabled}
        className="cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onReset}
        disabled={resetDisabled}
        aria-label={resetLabel}
        title={resetLabel}
        className="cursor-pointer h-8 w-8"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}
