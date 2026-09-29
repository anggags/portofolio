"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { AboutPreview, ArchivePreview, HomePreview } from "@/components/previews";
import { Rollover } from "@/components/rollover";
import { useTime } from "@/components/time-provider";
import { lockScroll } from "@/lib/lenis-registry";
import { site } from "@/lib/site";

const links = [
  { label: "Home", href: "/", Preview: HomePreview },
  { label: "Archive", href: "/archive", Preview: ArchivePreview },
  { label: "About", href: "/about", Preview: AboutPreview },
];

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(0);
  const { time } = useTime();

  // Intro/close motion. The overlay stays mounted so the previews stay live.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = root.querySelectorAll<HTMLElement>("[data-menu-item]");
    const previews = root.querySelector<HTMLElement>("[data-menu-previews]");
    const meta = root.querySelectorAll<HTMLElement>("[data-menu-meta]");

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    if (open) {
      tl.set(root, { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06 })
        .fromTo(previews, { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, "-=0.5")
        .fromTo(meta, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, "-=0.6");
    } else {
      tl.to(items, { yPercent: 110, duration: 0.4, stagger: 0.04 })
        .to(previews, { autoAlpha: 0, scale: 1.15, duration: 0.35 }, 0)
        .to(root, { autoAlpha: 0, pointerEvents: "none", duration: 0.3 });
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  // Scroll lock + escape handling.
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", open);
    lockScroll(open);
    if (open) closeRef.current?.focus();
    return () => {
      document.documentElement.classList.remove("is-locked");
      lockScroll(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      className="overlay menu-overlay"
      role="dialog"
      aria-modal={open ? "true" : undefined}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="content">
        <div className="headline">
          {links.map((link, index) => (
            <div
              key={link.href}
              className="headline-row"
              onMouseEnter={() => setActive(index)}
              data-menu-item
            >
              <Link href={link.href} className={`headline-link font-headline-1${index === active ? " is-active" : ""}`}>
                <span className="headline-link__mask">
                  <Rollover label={link.label} />
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div className="preview-container" data-menu-previews>
          {links.map((link, index) => (
            <div
              key={link.href}
              className="preview"
              data-menu-preview
              data-active={index === active}
              aria-hidden={index !== active}
              inert={index !== active ? true : undefined}
            >
              <link.Preview />
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <div className="menu-time font-body-12 uppercase tabular" data-menu-meta>
            <span className="opacity-50">Local time</span>
            <span>
              {time ?? "--:--"}
              <span className="time-dot">.</span>
            </span>
          </div>
          <ul className="menu-socials font-body-12 uppercase" data-menu-meta>
            {site.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} className="link" target={social.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener">
                  <Rollover label={social.label} />
                </a>
              </li>
            ))}
          </ul>
          <button ref={closeRef} type="button" className="menu-close font-body-12 uppercase" onClick={onClose} data-menu-meta>
            <span className="link">
              <Rollover label="Close" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
