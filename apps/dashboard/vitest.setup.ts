import "@testing-library/jest-dom/vitest";

// jsdom lacks matchMedia, which the theme manager reads via BaseLayout.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// Radix primitives observe layout; jsdom provides no implementation.
if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe(): void {
      /* jsdom stub */
    }
    unobserve(): void {
      /* jsdom stub */
    }
    disconnect(): void {
      /* jsdom stub */
    }
  } as unknown as typeof window.ResizeObserver;
}

// Radix Select relies on pointer capture and scrolling.
if (typeof Element !== "undefined" && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => undefined;
  Element.prototype.releasePointerCapture = () => undefined;
}

if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined;
}
