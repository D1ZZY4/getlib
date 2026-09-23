"use client"

import { Link } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { RefreshCw, Settings, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { downloadCsv, toCsv } from "@/lib/download"
import { searchActivityFixture } from "@/fixtures/analytics"

export function QuickActions() {
  const queryClient = useQueryClient()

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["getlib"] })
  }

  const handleExport = () => {
    downloadCsv(
      "search-activity.csv",
      toCsv(
        ["label", "searches", "withResults"],
        searchActivityFixture.map((point) => [
          point.label,
          point.searches,
          point.withResults,
        ]),
      ),
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button className="cursor-pointer" onClick={handleRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh data
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer" onSelect={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link to="/settings/appearance">
              <Settings className="h-4 w-4 mr-2" />
              Dashboard Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
