"use client";

import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    __applyTimeTheme?: (hour: number) => void;
  }
}

type ClockProps = {
  timezone: string;
  /** Offset in hours applied on top of the real local hour, -12…12. */
  offset: number;
  onOffsetChange: (offset: number) => void;
};

function format(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function Clock({ timezone, offset, onOffsetChange }: ClockProps) {
  const [time, setTime] = useState<string | null>(null);

  // Repaint the page colours whenever the effective hour changes.
  useEffect(() => {
    const apply = () => {
      const shifted = new Date(Date.now() + offset * 3_600_000);
      const hour = shifted.getHours() + shifted.getMinutes() / 60;
      window.__applyTimeTheme?.(hour);
      setTime(format(shifted, timezone));
    };

    apply();
    const id = setInterval(apply, 1000);
    return () => clearInterval(id);
  }, [offset, timezone]);

  const step = useCallback(
    (delta: number) => {
      const next = Math.max(-12, Math.min(12, offset + delta));
      onOffsetChange(next);
    },
    [offset, onOffsetChange],
  );

  // Drag anywhere on the clock to travel through the day.
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startOffset = offset;
    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);

    const onMove = (move: PointerEvent) => {
      const hours = (move.clientX - startX) / 40;
      onOffsetChange(Math.max(-12, Math.min(12, Math.round(startOffset + hours))));
    };

    const onUp = () => {
      el.releasePointerCapture(event.pointerId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        role="slider"
        tabIndex={0}
        aria-label="Local time — drag or use arrow keys to travel through the day"
        aria-valuemin={-12}
        aria-valuemax={12}
        aria-valuenow={offset}
        aria-valuetext={offset === 0 ? "Actual local time" : `${offset > 0 ? "+" : ""}${offset} hours`}
        className="flex cursor-ew-resize touch-none select-none items-center gap-1.5 uppercase"
      >
        <span className="t-label text-fg/60">{offset === 0 ? "Local Time" : "Time Travel"}</span>
        <span aria-hidden className="size-[0.3rem] animate-tick rounded-full bg-fg" />
        <span suppressHydrationWarning className="t-label tabular-nums">
          {time ?? "--:--"}
        </span>
      </div>

      {offset !== 0 ? (
        <button
          type="button"
          onClick={() => onOffsetChange(0)}
          className="t-label text-fg/60 uppercase transition-opacity duration-300 hover:opacity-100"
        >
          Reset ✕
        </button>
      ) : null}
    </div>
  );
}
