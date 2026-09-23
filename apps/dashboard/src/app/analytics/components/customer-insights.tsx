"use client";

import {
  ArrowUpIcon,
  BarChart3,
  MapPin,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface RetrievalVolumePoint {
  label: string;
  searches: number;
  withResults: number;
}

export interface RetrievalSourceRow {
  source: string;
  searches: number;
  share: string;
}

const chartConfig = {
  searches: {
    label: "Searches",
    color: "var(--chart-1)",
  },
  withResults: {
    label: "With results",
    color: "var(--chart-2)",
  },
};

export function CustomerInsights({
  volume,
  sources,
  totalSearches,
  successRate,
  activeSources,
}: {
  volume: RetrievalVolumePoint[];
  sources: RetrievalSourceRow[];
  totalSearches: string;
  successRate: string;
  activeSources: string;
}) {
  const [activeTab, setActiveTab] = useState("growth");
  const maxSearches = Math.max(0, ...sources.map((row) => row.searches));

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Retrieval Insights</CardTitle>
        <CardDescription>Search volume and source distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg h-12">
            <TabsTrigger
              value="growth"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Volume</span>
            </TabsTrigger>
            <TabsTrigger
              value="demographics"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Sources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="mt-8 space-y-6">
            <div className="grid gap-6">
              {/* Chart and Key Metrics Side by Side */}
              <div className="grid grid-cols-10 gap-6">
                {/* Chart Area - 70% */}
                <div className="col-span-10 xl:col-span-7">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">
                    Search Volume Trends
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[375px] w-full"
                  >
                    <BarChart
                      data={volume}
                      margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="label"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "var(--border)" }}
                        axisLine={{ stroke: "var(--border)" }}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "var(--border)" }}
                        axisLine={{ stroke: "var(--border)" }}
                        domain={[0, "dataMax"]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="searches"
                        fill="var(--color-searches)"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="withResults"
                        fill="var(--color-withResults)"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Key Metrics - 30% */}
                <div className="col-span-10 xl:col-span-3 space-y-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          Total Searches
                        </span>
                      </div>
                      <div className="text-2xl font-bold">{totalSearches}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        Volume growing period over period
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          With-Results Rate
                        </span>
                      </div>
                      <div className="text-2xl font-bold">{successRate}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        Queries returning knowledge
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Active Sources
                        </span>
                      </div>
                      <div className="text-2xl font-bold">{activeSources}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        Source types serving results
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">
                      Source
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Searches
                    </TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">
                      Share
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((row) => {
                    const shareWidth =
                      maxSearches > 0
                        ? Math.round((row.searches / maxSearches) * 100)
                        : 0;
                    return (
                      <TableRow
                        key={row.source}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium py-5 px-6">
                          {row.source}
                        </TableCell>
                        <TableCell className="text-right py-5 px-6 tabular-nums">
                          {row.searches.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-medium tabular-nums">
                              {row.share}
                            </span>
                            <div
                              className="h-1.5 w-full max-w-32 overflow-hidden rounded-full bg-muted"
                              role="presentation"
                            >
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${shareWidth}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
