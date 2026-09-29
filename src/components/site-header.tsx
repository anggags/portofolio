"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently occupying the viewport.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-medium tracking-tight"
          aria-label={`${site.name} — home`}
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface font-mono text-xs transition-colors duration-300 group-hover:border-border-strong">
            {site.monogram}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                active === link.href ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-foreground transition-transform duration-500 ease-out-expo",
                  active === link.href ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted lg:inline-flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            {site.availability}
          </span>

          <ThemeToggle />

          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href="#contact">Get in touch</a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "overflow-hidden border-border bg-background/95 backdrop-blur-md transition-all duration-500 ease-out-expo md:hidden",
          open ? "max-h-80 border-b" : "max-h-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-5 py-4 sm:px-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-base text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-2 px-2 text-xs text-muted">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            {site.availability}
          </div>
        </nav>
      </div>
    </header>
  );
}
