"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";

type RolloverProps = {
  label: string;
  className?: string;
  /** Stagger seed so sibling rollovers can cascade. */
  delay?: number;
};

/**
 * Two stacked copies of the same label; the second is parked at +100% behind an
 * overflow mask and rolls up on hover/focus. Markup matches the reference so
 * the intro timeline can address the inner spans directly.
 */
export function Rollover({ label, className = "roll", delay = 0 }: RolloverProps) {
  const root = useRef<HTMLSpanElement>(null);
  const animating = useRef(false);

  const roll = useCallback(
    (dir: -1 | 1) => {
      const el = root.current;
      if (!el) return;
      const [first, second] = Array.from(el.children) as HTMLElement[];
      if (!first || !second) return;
      if (animating.current) return;
      animating.current = true;

      gsap.to(first, {
        yPercent: dir * -100,
        duration: 0.5,
        delay,
        ease: "power3.inOut",
        onComplete: () => {
          animating.current = false;
        },
      });
      gsap.to(second, {
        yPercent: dir * -100,
        duration: 0.5,
        delay,
        ease: "power3.inOut",
      });
    },
    [delay]
  );

  return (
    <span
      ref={root}
      className={className}
      data-roll
      onMouseEnter={() => roll(1)}
      onMouseLeave={() => roll(-1)}
      onFocus={() => roll(1)}
      onBlur={() => roll(-1)}
    >
      <span>{label}</span>
      <span aria-hidden>{label}</span>
    </span>
  );
}
