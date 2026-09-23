import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StringListInput({
  label,
  description,
  values,
  onChange,
  placeholder,
}: {
  label: string
  description?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder: string
}) {
  const [draft, setDraft] = useState("")

  const addValue = () => {
    const trimmed = draft.trim()
    if (trimmed.length === 0 || values.includes(trimmed)) return
    onChange([...values, trimmed])
    setDraft("")
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description ? (
        <p className="text-muted-foreground text-xs">{description}</p>
      ) : null}
      {values.length > 0 ? (
        <ul className="space-y-1">
          {values.map((value) => (
            <li
              key={value}
              className="flex items-center justify-between rounded-md border px-3 py-1.5 font-mono text-xs"
            >
              <span className="truncate">{value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                aria-label={`Remove ${value}`}
                onClick={() =>
                  onChange(values.filter((item) => item !== value))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addValue()
            }
          }}
          placeholder={placeholder}
          className="font-mono text-xs"
          aria-label={`Add ${label}`}
        />
        <Button type="button" variant="outline" size="sm" onClick={addValue}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  )
}
