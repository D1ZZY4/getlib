// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import Page from "../page";

beforeEach(() => {
  localStorage.clear();
});

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

describe("API keys settings", () => {
  it("renders seeded keys masked, never in full", () => {
    renderPage();
    expect(screen.getByText("Production API Key")).toBeInTheDocument();
    expect(
      screen.queryByText("gl_a41f9c2d77e04b68c1d3f5a94234"),
    ).not.toBeInTheDocument();
  });

  it("creates a key and reveals the secret once", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "New API Key" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText("Name"), "Probe Key");
    await user.click(
      within(dialog).getByRole("button", { name: "Create Key" }),
    );
    expect(await screen.findByText("Probe Key")).toBeInTheDocument();
    expect(await screen.findByText("API key created")).toBeInTheDocument();
    expect(screen.getByText("New secret generated")).toBeInTheDocument();
  });

  it("revokes a key through the row actions", async () => {
    const user = userEvent.setup();
    renderPage();
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1] as HTMLElement;
    await user.click(
      within(firstDataRow).getByRole("button", { name: "More actions" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Revoke Key" }));
    expect(await screen.findByText("API key revoked")).toBeInTheDocument();
    expect(screen.getAllByText("revoked").length).toBeGreaterThan(0);
  });

  it("copies a secret from the row actions menu", async () => {
    const user = userEvent.setup();
    renderPage();
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1] as HTMLElement;
    await user.click(
      within(firstDataRow).getByRole("button", { name: "More actions" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Copy Secret" }));
    expect(
      await screen.findByText("Production API Key copied to clipboard"),
    ).toBeInTheDocument();
  });
});
