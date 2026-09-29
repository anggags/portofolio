"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: React.ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "header" | "footer";
  className?: string;
  /** Vertical offset in px the element travels from. */
  y?: number;
  /** Seconds to wait before the tween starts. */
  delay?: number;
  /** When set, direct element children are animated as a staggered group. */
  stagger?: number;
  /** ScrollTrigger start position. */
  start?: string;
};

/**
 * Scroll-triggered entrance animation.
 * Without `stagger` the container animates; with it, direct children do.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 24,
  delay = 0,
  stagger,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger ? Array.from(el.children) : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, start]);

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
