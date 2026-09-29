"use client";

import { useEffect, useState } from "react";

type LocalTimeProps = {
  timezone: string;
  className?: string;
};

export function LocalTime({ timezone, className }: LocalTimeProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const tick = () => setTime(format.format(new Date()));
    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <span className={className}>
      {/* Placeholder keeps server and first client render identical */}
      <span suppressHydrationWarning>{time ?? "--:--:--"}</span>
    </span>
  );
}
