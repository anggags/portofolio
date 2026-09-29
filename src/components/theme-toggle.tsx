"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true once the client has taken over.
 * Lets us render theme-dependent icons without a setState-in-effect cascade.
 */
function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={hydrated ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:border-border-strong hover:text-foreground"
    >
      {/* Rendered only after mount so the server and client markup match */}
      <span className="relative block size-4">
        {hydrated ? (
          <>
            <Sun
              className={`absolute inset-0 size-4 transition-all duration-500 ease-out-expo ${
                isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
              }`}
            />
            <Moon
              className={`absolute inset-0 size-4 transition-all duration-500 ease-out-expo ${
                isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
          </>
        ) : null}
      </span>
    </button>
  );
}
