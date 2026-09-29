"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { applyTheme, hourOf } from "@/lib/time-theme";

type TimeContextValue = {
  /** Hours offset from the real local clock, -12…12. */
  offset: number;
  setOffset: (offset: number) => void;
  reset: () => void;
  /** Formatted wall time for the given timezone, null before mount. */
  time: string | null;
  isTravelling: boolean;
};

const TimeContext = createContext<TimeContextValue | null>(null);

const clamp = (n: number) => Math.max(-12, Math.min(12, n));

function format(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function TimeProvider({ timezone, children }: { timezone: string; children: React.ReactNode }) {
  const [offset, setOffsetRaw] = useState(0);
  const [time, setTime] = useState<string | null>(null);

  // Drive the palette every second so it stays in step with the displayed clock.
  useEffect(() => {
    const apply = () => {
      const shifted = new Date(Date.now() + offset * 3_600_000);
      applyTheme(document.documentElement, hourOf(shifted));
      setTime(format(shifted, timezone));
    };

    apply();
    const id = setInterval(apply, 1000);
    return () => clearInterval(id);
  }, [offset, timezone]);

  const setOffset = useCallback((next: number) => setOffsetRaw(clamp(Math.round(next))), []);
  const reset = useCallback(() => setOffsetRaw(0), []);

  const value = useMemo<TimeContextValue>(
    () => ({ offset, setOffset, reset, time, isTravelling: offset !== 0 }),
    [offset, setOffset, reset, time]
  );

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}

export function useTime() {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error("useTime must be used inside <TimeProvider>");
  return ctx;
}
