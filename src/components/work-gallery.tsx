"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { useCallback, useLayoutEffect, useRef } from "react";
import type { Project } from "@/lib/site";

gsap.registerPlugin(Draggable);

/**
 * Draggable keeps the current offset on the numeric `x` property, but the
 * bundled typings describe a read/write accessor. Read it defensively so the
 * component keeps working across GSAP patch releases.
 */
function readX(instance: Draggable | null): number {
  if (!instance) return 0;
  const x = instance.x as unknown;
  return typeof x === "function" ? (x as () => number)() : (x as number);
}

/**
 * Draggable has no public setter, so move the target and let the instance
 * re-sync its bounds, rather than writing to `x` directly.
 */
function writeX(instance: Draggable, value: number) {
  const target = instance.target as HTMLElement | undefined;
  if (!target) return;
  gsap.set(target, { x: value });
  instance.update();
}

export function WorkGallery({ projects }: { projects: Project[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  const updateFill = useCallback(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;
    const track = draggableRef.current?.target as HTMLElement | undefined;
    const travel = track ? track.scrollWidth - wrap.clientWidth : 0;
    if (travel <= 0) {
      fill.style.transform = "scaleX(1)";
      return;
    }
    const x = Math.min(0, Math.max(-travel, readX(draggableRef.current)));
    fill.style.transform = `scaleX(${1 - Math.abs(x) / travel})`;
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clamp = () => {
      const travel = Math.max(0, track.scrollWidth - wrap.clientWidth);
      updateFill();
      return travel;
    };

    if (reduced) {
      // No transform dragging: hand the overflow back to the browser so the
      // work stays reachable when the visitor opts out of motion.
      wrap.style.overflowX = "auto";
      clamp();
      return;
    }

    const [instance] = Draggable.create(track, {
      type: "x",
      trigger: wrap,
      inertia: true,
      edgeResistance: 0.92,
      dragClickables: true,
      // Let vertical page scrolling pass through on touch.
      allowNativeTouchScrolling: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() {
        wrap.style.cursor = "grabbing";
      },
      onDrag: updateFill,
      onThrowUpdate: updateFill,
      onThrowComplete: updateFill,
    });

    draggableRef.current = instance;

    const applyBounds = () => {
      const travel = clamp();
      instance.applyBounds({ minX: -travel, maxX: 0 });
    };

    applyBounds();
    const observer = new ResizeObserver(applyBounds);
    observer.observe(wrap);
    observer.observe(track);

    return () => {
      observer.disconnect();
      instance.kill();
      draggableRef.current = null;
    };
  }, [updateFill, projects.length]);

  // Keyboard access — the gallery must not be drag-only.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = draggableRef.current;
    if (!current) return;

    const step = 240;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      writeX(current, Math.min(0, readX(current) - step));
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      writeX(current, Math.min(0, readX(current) + step));
    }
  };

  return (
    <div className="col-span-6 md:col-span-11 md:col-start-1">
      <div
        ref={wrapRef}
        data-lenis-prevent
        className="overflow-hidden"
      >
        <div
          ref={trackRef}
          role="region"
          aria-label="Selected work — drag horizontally or use arrow keys"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="flex w-max touch-pan-y items-end gap-[0.8rem] outline-offset-4"
        >
          {projects.map((project, index) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group block w-[72vw] shrink-0 sm:w-[46vw] lg:w-[26vw]"
            >
              <div className="t-label mb-3 flex items-baseline justify-between gap-3 text-fg/70">
                <span className="roll">
                  <span>{project.title}</span>
                  <span aria-hidden>{project.title}</span>
                </span>
                <span className="tabular-nums opacity-60">{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="relative aspect-[396/496] overflow-hidden border border-fg/15">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-105`}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--fg)_12%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--fg)_12%,transparent)_1px,transparent_1px)] [background-size:2.4rem_2.4rem]"
                />
                <span className="t-big absolute bottom-3 left-3 text-fg/25 transition-colors duration-500 group-hover:text-fg/45">
                  {project.year}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* drag progress */}
      <div className="mt-6">
        <div className="h-px w-full bg-fg/20">
          <div ref={fillRef} className="h-px w-full origin-left scale-x-1 bg-fg" />
        </div>
        <p className="t-label mt-3 text-fg/50">Drag or use arrow keys</p>
      </div>
    </div>
  );
}
