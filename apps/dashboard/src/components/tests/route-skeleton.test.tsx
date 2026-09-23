// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RouteSkeleton } from "../route-skeleton";

describe("RouteSkeleton", () => {
  it("announces loading and renders skeleton blocks", () => {
    const { container } = render(<RouteSkeleton />);
    expect(
      screen.getByRole("status", { name: "Loading page" }),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(10);
  });
});
