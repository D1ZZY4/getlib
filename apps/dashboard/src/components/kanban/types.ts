import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import type { ReactNode } from "react";

export interface KanbanColumnDef<TColumn extends string> {
  key: TColumn;
  title: string;
  description?: string;
  /** Optional dot color class (e.g. "bg-blue-500") shown before the title. */
  accentClassName?: string;
}

export interface KanbanDragHandle {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
  isDragging: boolean;
}

export interface KanbanBoardProps<TItem, TColumn extends string> {
  columns: KanbanColumnDef<TColumn>[];
  items: TItem[];
  getItemId: (item: TItem) => string;
  columnFor: (item: TItem) => TColumn;
  onMove: (id: string, column: TColumn) => void;
  renderCard: (item: TItem, drag: KanbanDragHandle) => ReactNode;
  renderOverlay?: (item: TItem) => ReactNode;
  emptyText?: string;
  gridClassName?: string;
}
