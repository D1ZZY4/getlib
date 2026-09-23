"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadCsv, toCsv } from "@/lib/download";

const chartConfig = {
  searches: {
    label: "Searches",
    color: "var(--primary)",
  },
  withResults: {
    label: "With results",
    color: "var(--primary)",
  },
};

export interface SearchActivityPoint {
  label: string;
  searches: number;
  withResults: number;
}

const RANGE_SIZES: Record<string, number> = {
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

export function SalesChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: SearchActivityPoint[];
}) {
  const [timeRange, setTimeRange] = useState("12m");
  const visibleData = data.slice(-(RANGE_SIZES[timeRange] ?? data.length));

  const handleExport = () => {
    downloadCsv(
      "search-activity.csv",
      toCsv(
        ["label", "searches", "withResults"],
        visibleData.map((point) => [
          point.label,
          point.searches,
          point.withResults,
        ]),
      ),
    );
  };

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m" className="cursor-pointer">
                Last 3 months
              </SelectItem>
              <SelectItem value="6m" className="cursor-pointer">
                Last 6 months
              </SelectItem>
              <SelectItem value="12m" className="cursor-pointer">
                Last 12 months
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="px-6 pb-6">
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart
              data={visibleData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-searches)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-searches)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="colorWithResults"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-withResults)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-withResults)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${Number(value).toLocaleString()}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="withResults"
                stackId="1"
                stroke="var(--color-withResults)"
                fill="url(#colorWithResults)"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="searches"
                stackId="2"
                stroke="var(--color-searches)"
                fill="url(#colorSearches)"
                strokeWidth={1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
