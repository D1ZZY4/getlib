// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import AddPage from "../add/page";
import EditPage from "../edit/page";

function renderAt(path: string, ui: ReactNode) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarConfigProvider>
          <Routes>
            <Route path="/libraries/add" element={ui} />
            <Route path="/libraries/:id/edit" element={ui} />
          </Routes>
          <Toaster />
        </SidebarConfigProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("Add library page", () => {
  it("renders all sections and validates", async () => {
    const user = userEvent.setup();
    renderAt("/libraries/add", <AddPage />);
    expect(screen.getByText("Identity")).toBeInTheDocument();
    expect(screen.getByText("Repository")).toBeInTheDocument();
    expect(screen.getByText("Sources")).toBeInTheDocument();
    expect(screen.getByText("AI Rules")).toBeInTheDocument();
    expect(screen.getByText("Advanced")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add Library" }));
    expect(
      await screen.findByText("Name must be at least 2 characters."),
    ).toBeInTheDocument();
  });

  it("submits a complete form", async () => {
    const user = userEvent.setup();
    renderAt("/libraries/add", <AddPage />);
    await user.type(screen.getByLabelText("Name"), "probe-lib");
    await user.type(screen.getByLabelText("Version"), "1.0.0");
    await user.type(
      screen.getByLabelText("Repository URL"),
      "https://github.com/example/probe-lib",
    );
    await user.type(
      screen.getByLabelText("Base URL"),
      "https://docs.example.com/probe-lib",
    );
    await user.click(screen.getByRole("button", { name: "Add Library" }));
    expect(
      await screen.findByText("Library probe-lib registered for indexing"),
    ).toBeInTheDocument();
  });
});

describe("Edit library page", () => {
  it("prefills the form and lists versions", async () => {
    renderAt("/libraries/lib-react/edit", <EditPage />);
    expect(await screen.findByDisplayValue("react")).toBeInTheDocument();
    expect(screen.getByText("Versions")).toBeInTheDocument();
    expect(screen.getByText("19.3.0")).toBeInTheDocument();
  });

  it("shows an empty state for unknown libraries", () => {
    renderAt("/libraries/nope/edit", <EditPage />);
    expect(screen.getByText("Library not found")).toBeInTheDocument();
  });

  it("queues a reindex from the versions table", async () => {
    const user = userEvent.setup();
    renderAt("/libraries/lib-react/edit", <EditPage />);
    const reindexButtons = await screen.findAllByRole("button", {
      name: "Reindex",
    });
    await user.click(reindexButtons[0] as HTMLElement);
    expect(
      await screen.findByText("Reindex queued for 19.3.0"),
    ).toBeInTheDocument();
  });
});
