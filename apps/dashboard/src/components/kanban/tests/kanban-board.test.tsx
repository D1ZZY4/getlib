// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { KanbanBoard } from "../kanban-board";

interface Note {
  id: string;
  title: string;
  lane: "todo" | "done";
}

const COLUMNS = [
  { key: "todo", title: "To Do", description: "Waiting" },
  { key: "done", title: "Done", description: "Finished" },
] as const;

const ITEMS: Note[] = [
  { id: "n-1", title: "First note", lane: "todo" },
  { id: "n-2", title: "Second note", lane: "todo" },
  { id: "n-3", title: "Third note", lane: "done" },
];

function renderBoard(onMove = vi.fn()) {
  const ui: ReactNode = (
    <KanbanBoard<Note, "todo" | "done">
      columns={[...COLUMNS]}
      items={ITEMS}
      getItemId={(item) => item.id}
      columnFor={(item) => item.lane}
      onMove={onMove}
      renderCard={(item) => <p>{item.title}</p>}
    />
  );
  return { ...render(ui), onMove };
}

describe("KanbanBoard", () => {
  it("groups items under their columns with counts", () => {
    renderBoard();
    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Done" })).toBeInTheDocument();
    const todo = screen
      .getByRole("heading", { name: "To Do" })
      .closest("div.rounded-xl") as HTMLElement;
    expect(within(todo).getByText("2")).toBeInTheDocument();
    expect(within(todo).getByText("First note")).toBeInTheDocument();
    expect(within(todo).getByText("Second note")).toBeInTheDocument();
    expect(within(todo).queryByText("Third note")).not.toBeInTheDocument();
  });

  it("renders custom empty text for vacant lanes", () => {
    renderBoard();
    expect(screen.queryByText("Drop items here")).not.toBeInTheDocument();
    const ui: ReactNode = (
      <KanbanBoard<Note, "todo" | "done">
        columns={[{ key: "todo", title: "To Do" }]}
        items={[]}
        getItemId={(item) => item.id}
        columnFor={(item) => item.lane}
        onMove={vi.fn()}
        renderCard={(item) => <p>{item.title}</p>}
        emptyText="Nothing here yet"
      />
    );
    render(ui);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("does not move anything on plain render", () => {
    const { onMove } = renderBoard();
    expect(onMove).not.toHaveBeenCalled();
  });
});
