"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTime } from "@/components/time-provider";
import { Rollover } from "@/components/rollover";

const PX_PER_HOUR = 40;

/**
 * The header's time control. A draggable ring doubles as the time-travel
 * handle: dragging horizontally shifts the clock, the ring rotates to the
 * travelled hour, and a "reset" line rolls up underneath the label.
 */
export function TimeWidget({ timezone }: { timezone: string }) {
  const { offset, setOffset, reset, time, isTravelling } = useTime();
  const [grabbing, setGrabbing] = useState(false);
  const ringRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // The ring behaves like an hour hand: 30° per hour.
  useEffect(() => {
    if (!ringRef.current) return;
    gsap.to(ringRef.current, {
      rotation: (offset / 24) * 360,
      duration: 0.6,
      ease: "power3.out",
      transformOrigin: "50% 50%",
    });
  }, [offset]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.toggle("egg--grabbing", grabbing);
    document.documentElement.classList.toggle("clock-grabbing", grabbing);
  }, [grabbing]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const startX = event.clientX;
    const startOffset = offset;
    setGrabbing(true);
    el.setPointerCapture(event.pointerId);

    const onMove = (move: PointerEvent) => {
      setOffset(startOffset + (move.clientX - startX) / PX_PER_HOUR);
    };
    const onUp = () => {
      setGrabbing(false);
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setOffset(offset + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setOffset(offset - 1);
    }
    if (event.key === "Home" || event.key === "Escape") {
      event.preventDefault();
      reset();
    }
  };

  return (
    <div ref={rootRef} className="time font-body-12">
      {/* Desktop: label, travelling hint, and the clock. */}
      <div className="time-inner">
        <span className={`time-toggle${isTravelling ? " is-travelling" : ""}`}>
          <span className="time-toggle__label">Local Time</span>
          <button
            type="button"
            onClick={reset}
            className="time-toggle__label time-toggle__reset"
            tabIndex={isTravelling ? 0 : -1}
            aria-hidden={!isTravelling}
          >
            Time Travel ✕
          </button>
        </span>
        <div className="time-time-inner">
          <span className="time-time">
            {time ?? "--:--"}
            <span className="time-dot">.</span>
          </span>
        </div>
      </div>

      {/* Mobile: the contact link doubles as the time display. */}
      <div className="time-contact-inner">
        <button type="button" className="time-contact" onPointerDown={onPointerDown} onKeyDown={onKeyDown}>
          <span className="time-contact__label">
            <Rollover label="Contact" className="link" />
          </span>
          <span className="time-contact__hint">Drag</span>
          <span className="time-contact__time">
            {time ?? "--:--"}
            <span className="time-dot">.</span>
          </span>
        </button>
        {isTravelling ? (
          <button type="button" onClick={reset} className="time-reset-mobile">
            Reset ✕
          </button>
        ) : null}
      </div>

      <div className="egg">
        <div className="circle" aria-hidden />
        <svg ref={ringRef} className="egg-svg" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div
          className="rotate"
          role="slider"
          tabIndex={0}
          aria-label="Local time — drag or use arrow keys to travel through the day"
          aria-valuemin={-12}
          aria-valuemax={12}
          aria-valuenow={offset}
          aria-valuetext={isTravelling ? `${offset > 0 ? "+" : ""}${offset} hours` : `Actual local time`}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />
        <div className="follow-rotate" aria-hidden>
          <div className="follower" />
        </div>
      </div>

      <span className="sr-only">{timezone}</span>
    </div>
  );
}
