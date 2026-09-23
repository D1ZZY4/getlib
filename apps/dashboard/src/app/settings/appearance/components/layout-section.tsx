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
  onCancel,
  onReset,
}: {
  current: LayoutState
  saved: LayoutState
  onSave: () => void
  onCancel: () => void
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
          saveDisabled={!dirty}
          onCancel={onCancel}
          cancelDisabled={!dirty}
          onReset={onReset}
          resetDisabled={atDefaults}
          resetLabel="Reset layout"
        />
      </CardHeader>
      <CardContent>
        <LayoutTab />
      </CardContent>
    </Card>
  )
}
