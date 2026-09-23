"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Ban, Eye, RotateCcw } from "lucide-react";
import { useState } from "react";
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

type BoardColumn = "queued" | "running" | "attention" | "done";

const COLUMNS: { key: BoardColumn; title: string; description: string }[] = [
  { key: "queued", title: "Queued", description: "Waiting for worker" },
  { key: "running", title: "Running", description: "Executing now" },
  {
    key: "attention",
    title: "Needs Attention",
    description: "Retrying or failed",
  },
  { key: "done", title: "Done", description: "Completed or canceled" },
];

function columnFor(job: IndexJob): BoardColumn {
  if (job.state === "queued") return "queued";
  if (job.state === "running") return "running";
  if (job.state === "completed" || job.state === "canceled") return "done";
  return "attention";
}

function DraggableJobCard({
  job,
  onInspect,
  onRetry,
  onCancel,
}: {
  job: IndexJob;
  onInspect: () => void;
  onRetry: () => void;
  onCancel: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id, data: { job } });
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
      ref={setNodeRef}
      style={
        transform ? { transform: CSS.Translate.toString(transform) } : undefined
      }
      className={`gap-0 py-4 ${isDragging ? "opacity-50" : ""}`}
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
          {...listeners}
          {...attributes}
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

function DroppableColumn({
  column,
  count,
  children,
}: {
  column: BoardColumn;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 rounded-xl p-1 transition-colors ${
        isOver ? "bg-muted/60" : ""
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold">
            {column === "queued" && "Queued"}
            {column === "running" && "Running"}
            {column === "attention" && "Needs Attention"}
            {column === "done" && "Done"}
          </h3>
        </div>
        <Badge variant="outline">{count}</Badge>
      </div>
      {children}
    </div>
  );
}

function stateClassName(state: IndexJob["state"]): string {
  if (state === "completed") {
    return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
  }
  if (state === "failed") {
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
  }
  if (state === "canceled" || state === "queued") {
    return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
  }
  return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
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
  const [activeJob, setActiveJob] = useState<IndexJob | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    const { active, over } = event;
    if (!over) return;
    const target = over.id as BoardColumn;
    if (target === columnFor(active.data.current?.job as IndexJob)) return;
    onMove(String(active.id), target);
  };

  return (
    <>
      <DndContext
        onDragStart={(event) => {
          setActiveJob(event.active.data.current?.job as IndexJob);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveJob(null)}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((column) => {
            const columnJobs = jobs.filter(
              (job) => columnFor(job) === column.key,
            );
            return (
              <DroppableColumn
                key={column.key}
                column={column.key}
                count={columnJobs.length}
              >
                <p className="text-muted-foreground px-1 text-xs">
                  {column.description}
                </p>
                {columnJobs.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Drop jobs here
                  </div>
                ) : (
                  columnJobs.map((job) => (
                    <DraggableJobCard
                      key={job.id}
                      job={job}
                      onInspect={() => setInspected(job)}
                      onRetry={() => onRetry(job.id)}
                      onCancel={() => onCancel(job.id)}
                    />
                  ))
                )}
              </DroppableColumn>
            );
          })}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeJob ? (
            <Card className="gap-0 py-4 opacity-90 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-xs">
                  {activeJob.id}
                </CardTitle>
                <p className="text-sm font-medium">{activeJob.library}</p>
              </CardHeader>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
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
