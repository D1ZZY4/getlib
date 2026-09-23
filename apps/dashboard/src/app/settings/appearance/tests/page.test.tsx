// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Page from "../page";
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
  it("disables every save action while its section is pristine", () => {
    renderPage();
    expect(
      screen.getByRole("button", { name: "Save Preferences" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save Theme" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save Layout" })).toBeDisabled();
  });

  it("saves font preferences through the preferences card", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("combobox", { name: "Font size" }));
    await user.click(screen.getByRole("option", { name: "Large" }));
    await user.click(
      screen.getByRole("button", { name: "Save Preferences" }),
    );
    const stored = JSON.parse(
      localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? "{}",
    );
    expect(stored.fontSize).toBe("large");
    expect(document.documentElement.style.fontSize).toBe("18px");
    expect(await screen.findByText("Preferences saved")).toBeInTheDocument();
  });

  it("saves the theme section independently", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Theme mode Dark" }));
    await user.click(
      screen.getByRole("button", { name: "Save Theme" }),
    );
    const stored = JSON.parse(
      localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? "{}",
    );
    expect(stored.theme).toBe("dark");
    expect(stored.layout).toEqual({
      variant: "inset",
      collapsible: "offcanvas",
      side: "left",
    });
    expect(stored.themeCustom.preset).toBe("default");
    expect(stored.themeCustom.radius).toBe("0.5rem");
    expect(await screen.findByText("Theme saved")).toBeInTheDocument();
  });

  it("renders the three organized sections", () => {
    renderPage();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Mode, color presets, radius, and brand colors.")).toBeInTheDocument();
    expect(
      screen.getByText("Sidebar variant, behavior, and position."),
    ).toBeInTheDocument();
  });

  it("saves the layout section independently", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText("Floating"));
    await user.click(screen.getByRole("button", { name: "Save Layout" }));
    const stored = JSON.parse(
      localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? "{}",
    );
    expect(stored.layout.variant).toBe("floating");
    expect(await screen.findByText("Layout saved")).toBeInTheDocument();
  });

  it("cancels theme changes back to stored values", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({
        theme: "dark",
        fontFamily: "inter",
        fontSize: "medium",
        sidebarWidth: "comfortable",
        contentWidth: "fluid",
        layout: {
          variant: "inset",
          collapsible: "offcanvas",
          side: "left",
        },
        themeCustom: {
          preset: "default",
          tweakcn: "",
          radius: "0.5rem",
          imported: null,
        },
      }),
    );
    renderPage();
    expect(screen.getByRole("button", { name: "Theme mode Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Theme mode Light" }));
    expect(screen.getByRole("button", { name: "Theme mode Light" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const cancels = screen.getAllByRole("button", { name: "Cancel" });
    await user.click(cancels[1] as HTMLElement);
    expect(screen.getByRole("button", { name: "Theme mode Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
