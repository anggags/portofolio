"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { site } from "@/lib/site";

const lines = ["Full-stack", "engineer building", "fast, quiet", "interfaces for", "the web"];

export function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-line] > span", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.06,
      });
      gsap.from("[data-fade]", { autoAlpha: 0, y: 16, duration: 0.9, ease: "expo.out", stagger: 0.1, delay: 0.35 });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope} className="shell pt-32 pb-20 md:pt-40">
      <div className="grid">
        <h1 className="t-display tight col-span-6 md:col-span-8 md:col-start-1">
          {lines.map((line) => (
            <span key={line} data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>

        <div
          data-fade
          className="col-span-6 mt-8 flex flex-col gap-3 md:col-span-4 md:col-start-10 md:mt-0 md:self-end"
        >
          <p className="t-body text-fg/70">{site.description}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="t-label text-fg/70 transition-colors hover:text-fg"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
