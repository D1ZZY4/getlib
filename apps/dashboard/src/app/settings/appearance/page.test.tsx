// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Page from "./page";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { Toaster } from "@/components/ui/sonner";
import { APPEARANCE_STORAGE_KEY } from "@/lib/appearance";

function renderPage() {
  const ui: ReactNode = <Page />;
  return render(
    <MemoryRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarConfigProvider>
          {ui}
          <Toaster />
        </SidebarConfigProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.style.fontSize = "";
  document.documentElement.style.removeProperty("--font-sans");
});

describe("Appearance settings", () => {
  it("saves preferences, applies them, and toasts", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("button", { name: "Save Preferences" }),
    );
    const stored = JSON.parse(
      localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? "{}",
    );
    expect(stored.theme).toBe("system");
    expect(document.documentElement.style.fontSize).toBe("16px");
    expect(await screen.findByText("Preferences saved")).toBeInTheDocument();
  });

  it("renders the three organized sections", () => {
    renderPage();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Color presets, radius, and brand colors.")).toBeInTheDocument();
    expect(
      screen.getByText("Sidebar variant, behavior, and position."),
    ).toBeInTheDocument();
  });

  it("loads stored values and cancels back to them", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({
        theme: "dark",
        fontFamily: "inter",
        fontSize: "medium",
        sidebarWidth: "comfortable",
        contentWidth: "fluid",
      }),
    );
    renderPage();
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Light" }));
    expect(screen.getByRole("radio", { name: "Light" })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked();
  });
});
