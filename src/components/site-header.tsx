"use client";

import { useEffect, useState } from "react";
import { Clock } from "@/components/clock";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Two stacked copies of the label; the second rolls up on hover. */
function Rollover({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("roll", className)}>
      <span>{label}</span>
      <span aria-hidden>{label}</span>
    </span>
  );
}

export function SiteHeader() {
  const [offset, setOffset] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "bg-bg/85 backdrop-blur-sm" : "bg-bg",
      )}
    >
      <div className="shell">
        <div className="grid items-center py-4">
          {/* logo */}
          <a
            href="#top"
            aria-label={`${site.name} — top`}
            className="t-label col-span-3 flex flex-col leading-[0.95] font-medium tracking-tight uppercase"
          >
            <Rollover label={site.firstName} />
            <Rollover label={site.lastName} />
          </a>

          {/* nav */}
          <nav aria-label="Primary" className="col-span-3 hidden md:col-span-2 md:col-start-9 md:block">
            <ul className="flex flex-col items-start gap-0.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="t-label block text-fg/70 hover:text-fg">
                    <Rollover label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* clock */}
          <div className="col-span-3 md:col-span-2 md:col-start-13">
            <Clock timezone={site.timezone} offset={offset} onOffsetChange={setOffset} />
          </div>
        </div>
      </div>

      {/* mobile nav */}
      <nav aria-label="Mobile" className="shell md:hidden">
        <ul className="flex flex-wrap gap-x-6 gap-y-1 border-t border-fg/15 py-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="t-label text-fg/70 hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
