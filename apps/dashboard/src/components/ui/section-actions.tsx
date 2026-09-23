import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

/**
 * Shared Save action row for settings section cards.
 *
 * The Save button is disabled while its section has no unsaved changes;
 * callers compute that from their own dirty state. The secondary action
 * (Cancel or reset-to-defaults) renders next to it.
 */
export function SectionActions({
  saveLabel,
  disabled,
  onSave,
  submitFormId,
  children,
}: {
  saveLabel: string
  disabled?: boolean
  onSave?: () => void
  submitFormId?: string
  children?: ReactNode
}) {
  return (
    <div className="ml-auto flex items-center gap-2">
      {submitFormId ? (
        <Button
          type="submit"
          form={submitFormId}
          variant="outline"
          size="sm"
          disabled={disabled}
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
          disabled={disabled}
          className="cursor-pointer"
        >
          {saveLabel}
        </Button>
      )}
      {children}
    </div>
  )
}
