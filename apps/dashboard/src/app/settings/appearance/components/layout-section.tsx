import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LayoutTab } from "@/components/theme-customizer/layout-tab"

export function LayoutSection({
  onSave,
  onReset,
}: {
  onSave: () => void
  onReset: () => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Layout</CardTitle>
          <CardDescription>
            Sidebar variant, behavior, and position.
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSave}
            className="cursor-pointer"
          >
            Save Layout
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onReset}
            aria-label="Reset layout"
            className="cursor-pointer h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <LayoutTab />
      </CardContent>
    </Card>
  )
}
