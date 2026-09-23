"use client";

import { Ban, Eye, RotateCcw } from "lucide-react";
import { useState } from "react";
import { KanbanBoard, type KanbanDragHandle } from "@/components/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import type { IndexJob } from "@/fixtures/indexing";
import { getStateColor } from "./data-table-columns";

type BoardColumn = "queued" | "running" | "attention" | "done";

const COLUMNS: {
  key: BoardColumn;
  title: string;
  description: string;
  accentClassName: string;
}[] = [
  {
    key: "queued",
    title: "Queued",
    description: "Waiting for worker",
    accentClassName: "bg-gray-400",
  },
  {
    key: "running",
    title: "Running",
    description: "Executing now",
    accentClassName: "bg-blue-500",
  },
  {
    key: "attention",
    title: "Needs Attention",
    description: "Retrying or failed",
    accentClassName: "bg-amber-500",
  },
  {
    key: "done",
    title: "Done",
    description: "Completed or canceled",
    accentClassName: "bg-green-500",
  },
];

function columnFor(job: IndexJob): BoardColumn {
  if (job.state === "queued") return "queued";
  if (job.state === "running") return "running";
  if (job.state === "completed" || job.state === "canceled") return "done";
  return "attention";
}

function JobCard({
  job,
  drag,
  onInspect,
  onRetry,
  onCancel,
}: {
  job: IndexJob;
  drag: KanbanDragHandle;
  onInspect: () => void;
  onRetry: () => void;
  onCancel: () => void;
}) {
  const retryable =
    job.state === "failed" ||
    job.state === "retrying" ||
    job.state === "canceled";
  const cancelable =
    job.state === "queued" ||
    job.state === "running" ||
    job.state === "retrying";
  return (
    <Card
      className={`gap-0 py-4 transition-shadow duration-200 hover:shadow-md ${
        drag.isDragging ? "rotate-2 shadow-xl" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-mono text-xs">{job.id}</CardTitle>
          <Badge variant="secondary" className={stateClassName(job.state)}>
            {job.state}
          </Badge>
        </div>
        <button
          type="button"
          aria-label={`Drag ${job.id}`}
          className="cursor-grab touch-none text-left active:cursor-grabbing"
          {...drag.listeners}
          {...drag.attributes}
        >
          <p className="text-sm font-medium">
            {job.library}
            <span className="text-muted-foreground font-normal">
              {" "}
              · {job.version}
            </span>
          </p>
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-xs">{job.step}</p>
        <div className="flex items-center gap-2">
          <Progress value={job.progress} className="h-1.5 flex-1" />
          <span className="text-xs tabular-nums">{job.progress}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs tabular-nums">
            {job.duration}
            {job.retries > 0 ? ` · ${job.retries} retries` : ""}
          </span>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={onInspect}
            >
              <Eye className="size-4" />
              <span className="sr-only">Inspect job</span>
            </Button>
            {retryable ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={onRetry}
              >
                <RotateCcw className="size-4" />
                <span className="sr-only">Retry job</span>
              </Button>
            ) : null}
            {cancelable ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={onCancel}
              >
                <Ban className="size-4" />
                <span className="sr-only">Cancel job</span>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function stateClassName(state: IndexJob["state"]): string {
  return getStateColor(state);
}

export function JobBoard({
  jobs,
  onRetry,
  onCancel,
  onMove,
}: {
  jobs: IndexJob[];
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onMove: (id: string, column: BoardColumn) => void;
}) {
  const [inspected, setInspected] = useState<IndexJob | null>(null);

  return (
    <>
      <KanbanBoard
        columns={COLUMNS}
        items={jobs}
        getItemId={(job) => job.id}
        columnFor={columnFor}
        onMove={onMove}
        renderCard={(job, drag) => (
          <JobCard
            job={job}
            drag={drag}
            onInspect={() => setInspected(job)}
            onRetry={() => onRetry(job.id)}
            onCancel={() => onCancel(job.id)}
          />
        )}
        renderOverlay={(job) => (
          <Card className="gap-0 py-4 opacity-90 shadow-xl rotate-3 cursor-grabbing">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs">{job.id}</CardTitle>
              <p className="text-sm font-medium">{job.library}</p>
            </CardHeader>
          </Card>
        )}
        emptyText="Drop jobs here"
      />
      <Drawer
        open={inspected !== null}
        onOpenChange={(open) => {
          if (!open) setInspected(null);
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {inspected
                ? `${inspected.id} · ${inspected.library}`
                : "Job detail"}
            </DrawerTitle>
            <DrawerDescription>
              {inspected
                ? `Step: ${inspected.step} · ${inspected.progress}% · ${inspected.duration}`
                : null}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-3 px-4 pb-4 text-sm">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">State</span>
              <span className="font-medium">{inspected?.state}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Retries</span>
              <span className="font-medium tabular-nums">
                {inspected?.retries ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">{inspected?.updated}</span>
            </div>
            {inspected?.error ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
                <p className="font-medium">Sanitized error</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {inspected.error}
                </p>
              </div>
            ) : null}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
