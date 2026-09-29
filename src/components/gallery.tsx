"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { useCallback, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Rollover } from "@/components/rollover";
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

export function Gallery({ projects }: { projects: Project[] }) {
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

    const step = Math.round(window.innerWidth * 0.4);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      writeX(current, Math.min(0, readX(current) - step));
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      writeX(current, Math.min(0, readX(current) + step));
    }
    if (event.key === "Home") {
      event.preventDefault();
      writeX(current, 0);
    }
  };

  return (
    <div className="gallery">
      <div ref={wrapRef} className="gallery-viewport" data-lenis-prevent>
        <div
          ref={trackRef}
          className="gallery-items"
          role="region"
          aria-label="Selected work — drag horizontally or use arrow keys"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/${project.slug}`}
              className="gallery-item"
              style={{ zIndex: projects.length - index }}
              draggable={false}
            >
              <div className="img-wrap">
                <div
                  className="artwork"
                  style={
                    {
                      "--tone-a": project.tone[0],
                      "--tone-b": project.tone[1],
                    } as React.CSSProperties
                  }
                  aria-hidden
                />
                {/* Overlay strength is driven by --img-over-opacity, so the
                    artwork darkens and lightens with the time of day. */}
                <div className="img-over" aria-hidden />
              </div>
              <div className="gallery-item-info">
                <span className="index tabular">{String(index + 1).padStart(2, "0")}</span>
                <span className="name font-headline-2">
                  <Rollover label={project.name} />
                </span>
                <span className="year tabular">{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="progress" aria-hidden>
        <div className="progress-track">
          <div ref={fillRef} className="progress-fill" />
        </div>
      </div>
    </div>
  );
}
