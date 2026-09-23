import { Activity, BookOpen, Database, FileText } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { MetricsOverview } from "./components/metrics-overview"
import { SalesChart } from "./components/sales-chart"
import { RecentTransactions } from "./components/recent-transactions"
import { TopProducts } from "./components/top-products"
import { CustomerInsights } from "./components/customer-insights"
import { QuickActions } from "./components/quick-actions"
import { RevenueBreakdown } from "./components/revenue-breakdown"
import {
  analyticsMetricsFixture,
  knowledgeSourcesFixture,
  recentJobsFixture,
  retrievalSourcesFixture,
  retrievalVolumeFixture,
  searchActivityFixture,
  topLibrariesFixture,
} from "@/fixtures/analytics"

const metricIcons = [BookOpen, FileText, Activity, Database]

export default function Dashboard2() {
  const metrics = analyticsMetricsFixture.map((metric, index) => ({
    ...metric,
    icon: metricIcons[index % metricIcons.length] ?? BookOpen,
  }))
  const totalSearches = searchActivityFixture
    .reduce((sum, point) => sum + point.searches, 0)
    .toLocaleString()
  const withResults = searchActivityFixture.reduce(
    (sum, point) => sum + point.withResults,
    0,
  )
  const successRate = `${(
    (withResults / searchActivityFixture.reduce((sum, p) => sum + p.searches, 0)) *
    100
  ).toFixed(1)}%`

  return (
    <BaseLayout>
      <div className="flex-1 space-y-6 px-6 pt-0">
        {/* Enhanced Header */}

        <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Monitor search volume, indexing throughput, and source distribution
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="@container/main space-y-6">
          {/* Top Row - Key Metrics */}

          <MetricsOverview metrics={metrics} />

          {/* Second Row - Charts in 6-6 columns */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <SalesChart
              title="Search Activity"
              description="Searches vs queries with results"
              data={searchActivityFixture}
            />
            <RevenueBreakdown
              title="Knowledge by Source"
              description="Indexed document distribution"
              items={knowledgeSourcesFixture}
              unit="documents"
            />
          </div>

          {/* Third Row - Two Column Layout */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <RecentTransactions
              title="Recent Indexing Jobs"
              description="Latest pipeline runs per library"
              jobs={recentJobsFixture}
            />
            <TopProducts
              title="Top Libraries"
              description="Most indexed libraries by coverage"
              libraries={topLibrariesFixture}
            />
          </div>

          {/* Fourth Row - Retrieval Insights */}
          <CustomerInsights
            volume={retrievalVolumeFixture}
            sources={retrievalSourcesFixture}
            totalSearches={totalSearches}
            successRate={successRate}
            activeSources={String(knowledgeSourcesFixture.length)}
          />
        </div>
      </div>
    </BaseLayout>
  )
}
