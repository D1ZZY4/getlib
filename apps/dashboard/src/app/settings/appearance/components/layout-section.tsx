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
import { LayoutTab } from "@/components/theme-customizer/layout-tab"
import {
  DEFAULT_LAYOUT,
  sameLayout,
  type LayoutState,
} from "@/contexts/sidebar-state"

export function LayoutSection({
  current,
  saved,
  onSave,
  onReset,
}: {
  current: LayoutState
  saved: LayoutState
  onSave: () => void
  onReset: () => void
}) {
  const dirty = !sameLayout(current, saved)
  const atDefaults = sameLayout(current, DEFAULT_LAYOUT)
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Layout</CardTitle>
          <CardDescription>
            Sidebar variant, behavior, and position.
          </CardDescription>
        </div>
        <SectionActions
          saveLabel="Save Layout"
          onSave={onSave}
          disabled={!dirty}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={atDefaults}
            aria-label="Reset layout"
            className="cursor-pointer h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </SectionActions>
      </CardHeader>
      <CardContent>
        <LayoutTab />
      </CardContent>
    </Card>
  )
}
