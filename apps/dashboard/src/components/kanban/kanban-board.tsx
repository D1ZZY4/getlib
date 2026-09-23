"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type {
  KanbanBoardProps,
  KanbanColumnDef,
  KanbanDragHandle,
} from "./types";

function KanbanItem<TItem>({
  id,
  item,
  render,
}: {
  id: string;
  item: TItem;
  render: (item: TItem, drag: KanbanDragHandle) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { item } });

  return (
    <div
      ref={setNodeRef}
      style={
        transform ? { transform: CSS.Translate.toString(transform) } : undefined
      }
      className={isDragging ? "opacity-50" : undefined}
    >
      {render(item, { attributes, listeners, isDragging })}
    </div>
  );
}

function KanbanColumn<TItem, TColumn extends string>({
  column,
  items,
  emptyText,
  children,
}: {
  column: KanbanColumnDef<TColumn>;
  items: TItem[];
  emptyText: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 rounded-xl p-1 transition-colors ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {column.accentClassName ? (
            <span
              aria-hidden="true"
              className={`size-2 shrink-0 rounded-full ${column.accentClassName}`}
            />
          ) : null}
          <h3 className="text-sm font-semibold">{column.title}</h3>
        </div>
        <Badge variant="outline">{items.length}</Badge>
      </div>
      {column.description ? (
        <p className="text-muted-foreground px-1 text-xs">
          {column.description}
        </p>
      ) : null}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function KanbanBoard<TItem, TColumn extends string>({
  columns,
  items,
  getItemId,
  columnFor,
  onMove,
  renderCard,
  renderOverlay,
  emptyText = "Drop items here",
  gridClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
}: KanbanBoardProps<TItem, TColumn>) {
  const [activeItem, setActiveItem] = useState<TItem | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;
    const item = items.find(
      (candidate) => getItemId(candidate) === String(active.id),
    );
    if (!item) return;
    const target = over.id as TColumn;
    if (target === columnFor(item)) return;
    onMove(String(active.id), target);
  };

  return (
    <DndContext
      onDragStart={(event) => {
        setActiveItem((event.active.data.current?.item as TItem) ?? null);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItem(null)}
    >
      <div className={gridClassName}>
        {columns.map((column) => {
          const columnItems = items.filter(
            (item) => columnFor(item) === column.key,
          );
          return (
            <KanbanColumn
              key={column.key}
              column={column}
              items={columnItems}
              emptyText={emptyText}
            >
              {columnItems.map((item) => (
                <KanbanItem
                  key={getItemId(item)}
                  id={getItemId(item)}
                  item={item}
                  render={renderCard}
                />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeItem && renderOverlay ? renderOverlay(activeItem) : null}
      </DragOverlay>
    </DndContext>
  );
}
