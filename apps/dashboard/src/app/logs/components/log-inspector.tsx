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
import type { LogEntry } from "./data-table-columns";

export function LogInspector({
  entry,
  onClose,
}: {
  entry: LogEntry | null;
  onClose: () => void;
}) {
  return (
    <Drawer open={entry !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Log entry detail</DrawerTitle>
          <DrawerDescription>
            {entry ? `${entry.level} · ${entry.service}` : null}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 px-4 pb-4 text-sm">
          <p className="font-mono text-xs">{entry?.message}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Time</span>
              <span className="font-mono text-xs">{entry?.time}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Request</span>
              <span className="font-mono text-xs">{entry?.request}</span>
            </div>
          </div>
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
