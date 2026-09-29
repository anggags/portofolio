"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Vertical rail that draws itself as the timeline scrolls into view. */
export function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-y-0 left-[7px] w-px origin-top bg-gradient-to-b from-foreground/40 via-border to-transparent md:left-[9px]"
    >
      <div ref={ref} className="h-full w-full bg-gradient-to-b from-foreground to-transparent" />
    </div>
  );
}
