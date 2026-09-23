"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { IndexJob } from "@/fixtures/indexing";

export function JobInspector({
  job,
  onClose,
}: {
  job: IndexJob | null;
  onClose: () => void;
}) {
  return (
    <Drawer open={job !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {job ? `${job.id} · ${job.library}` : "Job detail"}
          </DrawerTitle>
          <DrawerDescription>
            {job
              ? `Step: ${job.step} · ${job.progress}% · ${job.duration}`
              : null}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 px-4 pb-4 text-sm">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">State</span>
            <span className="font-medium">{job?.state}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Retries</span>
            <span className="font-medium tabular-nums">
              {job?.retries ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Updated</span>
            <span className="font-medium">{job?.updated}</span>
          </div>
          {job?.error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
              <p className="font-medium">Sanitized error</p>
              <p className="text-muted-foreground font-mono text-xs">
                {job.error}
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
  );
}
