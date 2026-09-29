"use client";

import { useCallback, useEffect, useRef } from "react";
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

  /*
     Keyboard parity with hover. A <span> is not focusable, so React's onFocus
     on this element would never fire — the browser focuses the wrapping
     <a>/<button>, and a descendant's focus handler does not run for it. Listen
     for focusin on the parent instead and only roll back once focus has truly
     left it.
  */
  useEffect(() => {
    const el = root.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const onFocusIn = () => roll(1);
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && host.contains(next)) return;
      roll(-1);
    };

    host.addEventListener("focusin", onFocusIn);
    host.addEventListener("focusout", onFocusOut);
    return () => {
      host.removeEventListener("focusin", onFocusIn);
      host.removeEventListener("focusout", onFocusOut);
    };
  }, [roll]);

  return (
    <span ref={root} className={className} data-roll onMouseEnter={() => roll(1)} onMouseLeave={() => roll(-1)}>
      <span>{label}</span>
      <span aria-hidden>{label}</span>
    </span>
  );
}
