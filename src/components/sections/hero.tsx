"use client";

import { gsap } from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const socialIcons = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
} as const;

const headline = [
  ["I", "build"],
  ["fast,"],
  ["thoughtful", "interfaces"],
  ["for", "the", "web."],
];

export function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Badge + body copy fade in with the headline.
      tl.from("[data-hero-fade]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.08,
      })
        // Each word slides up from behind its mask.
        .from(
          "[data-word] > span",
          {
            yPercent: 118,
            duration: 1.1,
            stagger: 0.07,
          },
          0.15,
        )
        .from("[data-hero-divider]", { scaleX: 0, duration: 1.2 }, 0.6)
        .from("[data-scroll-cue]", { autoAlpha: 0, y: 10, duration: 0.8 }, 0.9);
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
        <div
          data-hero-fade
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted"
        >
          <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
          {site.availability}
        </div>

        <h1 className="mt-8 text-balance-tight text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-7xl">
          {headline.map((line, lineIndex) => (
            <span key={lineIndex} className="block overflow-hidden pb-[0.08em]">
              {line.map((word) => (
                <span key={word} data-word className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span className="inline-block">
                    {word}
                    {" "}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div
          data-hero-divider
          className="mt-10 h-px w-full origin-left bg-gradient-to-r from-border via-border to-transparent"
        />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <p
            data-hero-fade
            className="max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {site.description} Currently building design systems and realtime dashboards at{" "}
            <span className="text-foreground">Nimbus Labs</span>.
          </p>

          <div data-hero-fade className="flex flex-col items-start gap-6 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href="#projects">
                  View work
                  <ArrowUpRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#contact">Get in touch</a>
              </Button>
            </div>

            <ul className="flex items-center gap-5">
              {site.socials.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
                    >
                      <Icon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                      <span className="hidden sm:inline">{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <a
          href="#about"
          data-scroll-cue
          aria-label="Scroll to about section"
          className="mt-20 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowDown className="size-3.5 animate-bounce" />
          Scroll
        </a>
      </div>
    </div>
  );
}
