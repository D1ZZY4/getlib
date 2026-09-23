// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { APPEARANCE_STORAGE_KEY, DEFAULT_SNAPSHOT } from "@/lib/appearance";
import { BaseLayout } from "../layouts/base-layout";

function storeLayoutVariant(variant: "inset" | "sidebar") {
  localStorage.setItem(
    APPEARANCE_STORAGE_KEY,
    JSON.stringify({
      ...DEFAULT_SNAPSHOT,
      layout: { ...DEFAULT_SNAPSHOT.layout, variant },
    }),
  );
}

function renderLayout() {
  const ui: ReactNode = (
    <BaseLayout title="Probe" description="probe">
      <div>body content</div>
    </BaseLayout>
  );
  return render(
    <MemoryRouter>
      <SidebarConfigProvider>{ui}</SidebarConfigProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("BaseLayout framed shell", () => {
  it("locks the inset card to the viewport with an inner scroll region", () => {
    storeLayoutVariant("inset");
    renderLayout();
    const main = screen.getByRole("main");
    expect(main.className).toContain("md:h-[calc(100svh-1rem)]");
    expect(main.innerHTML).toContain("md:overflow-y-auto");
    expect(screen.getByText("body content")).toBeInTheDocument();
  });

  it("keeps document scroll for non-inset variants", () => {
    storeLayoutVariant("sidebar");
    renderLayout();
    const main = screen.getByRole("main");
    expect(main.className).not.toContain("md:h-[calc(100svh-1rem)]");
    expect(main.innerHTML).not.toContain("md:overflow-y-auto");
  });
});
