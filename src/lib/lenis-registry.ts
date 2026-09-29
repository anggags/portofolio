"use client";

import type Lenis from "lenis";

/**
 * The single Lenis instance lives in one module so the page transition and the
 * overlays can freeze scrolling without threading a context through the tree.
 */
let instance: Lenis | null = null;

export function registerLenis(next: Lenis | null) {
  instance = next;
}

export function lockScroll(locked: boolean) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}
