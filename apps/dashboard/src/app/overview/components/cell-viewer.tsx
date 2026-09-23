"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import type { schema } from "../schemas/task-schema";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--primary)" },
  mobile: { label: "Mobile", color: "var(--primary)" },
} satisfies ChartConfig;

export function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left cursor-pointer"
        >
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months.
                </div>
              </div>
              <Separator />
            </>
          )}
          <CellViewerForm item={item} />
        </div>
        <DrawerFooter>
          <Button className="cursor-pointer">Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Done
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CellViewerForm({ item }: { item: z.infer<typeof schema> }) {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="header">Header</Label>
        <Input id="header" defaultValue={item.header} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="type">Type</Label>
          <Select defaultValue={item.type}>
            <SelectTrigger id="type" className="w-full cursor-pointer">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Table of Contents",
                "Executive Summary",
                "Technical Approach",
                "Design",
                "Capabilities",
                "Focus Documents",
                "Narrative",
                "Cover Page",
              ].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={item.status}>
            <SelectTrigger id="status" className="w-full cursor-pointer">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="target">Target</Label>
          <Input id="target" defaultValue={item.target} />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="limit">Limit</Label>
          <Input id="limit" defaultValue={item.limit} />
        </div>
      </div>
      <ReviewerSelect reviewer={item.reviewer} />
    </form>
  );
}

function ReviewerSelect({ reviewer }: { reviewer: string }) {
  const [value, setValue] = useState(reviewer);
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="reviewer">Reviewer</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id="reviewer" className="w-full cursor-pointer">
          <SelectValue placeholder="Select a reviewer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
          <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
          <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
