"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Single shared dim layer. The shell keeps the menu and the contact modal
 * mutually exclusive, so one backdrop serves both.
 */
export function Backdrop({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = visible
      ? gsap.to(el, { autoAlpha: 1, duration: 0.45, ease: "power2.inOut", pointerEvents: "auto" })
      : gsap.to(el, { autoAlpha: 0, duration: 0.35, ease: "power2.inOut", pointerEvents: "none" });
    return () => {
      tween.kill();
    };
  }, [visible]);

  return <div ref={ref} className="backdrop" onClick={onClick} aria-hidden />;
}
