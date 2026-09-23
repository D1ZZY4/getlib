"use client";

import { Plus } from "lucide-react";
import type { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { schema } from "../schemas/task-schema";
import { IsolatedTaskTable } from "./isolated-table";

type TaskRow = z.infer<typeof schema>;

export function DataTable({
  data: initialData,
  pastPerformanceData = [],
  keyPersonnelData = [],
  focusDocumentsData = [],
}: {
  data: TaskRow[];
  pastPerformanceData?: TaskRow[];
  keyPersonnelData?: TaskRow[];
  focusDocumentsData?: TaskRow[];
}) {
  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 flex-wrap gap-3">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit sm:hidden cursor-pointer"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="past-performance">Past Performance</SelectItem>
            <SelectItem value="key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 sm:flex">
          <TabsTrigger value="outline" className="cursor-pointer">
            Outline
          </TabsTrigger>
          <TabsTrigger value="past-performance" className="cursor-pointer">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel" className="cursor-pointer">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents" className="cursor-pointer">
            Focus Documents
          </TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Plus />
          <span className="hidden lg:inline">Add Section</span>
        </Button>
      </div>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <IsolatedTaskTable initialData={initialData} />
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <IsolatedTaskTable initialData={pastPerformanceData} />
      </TabsContent>
      <TabsContent
        value="key-personnel"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <IsolatedTaskTable initialData={keyPersonnelData} />
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <IsolatedTaskTable initialData={focusDocumentsData} />
      </TabsContent>
    </Tabs>
  );
}
