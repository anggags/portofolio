"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { lockScroll } from "@/lib/lenis-registry";

gsap.registerPlugin(CustomEase);

const EASE_NAME = "pageSpread";
if (typeof CustomEase.get !== "function" || !CustomEase.get(EASE_NAME)) {
  CustomEase.create(EASE_NAME, "0.46, 0, 0.09, 0.99");
}

/* Every value below is lifted from the reference transition, including the
   per-breakpoint xPercent geometry, so the wipe reads the same. */
const DURATION = 1.3;
const TITLE_DURATION = 1.2;
const SCALE = 0.75;
const MOBILE_SCALE = 0.6;
const EXIT_SCALE = 1.15;
const MOBILE_EXIT_SCALE = 0.85 / MOBILE_SCALE;
const ENTER_LAG = 0.069;
const BACK_LAG = 0.367;
const FWD_LAG = 0.1;

const GEOMETRY = {
  desktop: { oldX: 7.5, newXBase: 39.75, newXStride: 34.25 },
  mobile: { oldX: 0, newXBase: 65, newXStride: 65 },
} as const;

const F = { oldX: 67.6, enterX: -123.88, exitTravel: 63.04 } as const;

/** --cut target per breakpoint: mobile clips fully, desktop reveals 37.4%. */
const cutTarget = (isMobile: boolean) => (isMobile ? 100 : 37.4);

function isInternalLink(target: EventTarget | null) {
  const anchor = (target as HTMLElement | null)?.closest?.("a");
  if (!anchor) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (/^(mailto:|tel:|https?:)/i.test(href)) return false;
  return true;
}

/**
 * Animate `--cut` through a numeric proxy. GSAP can animate custom properties
 * directly, but going through a number keeps the interpolation identical across
 * browser versions.
 */
function tweenCut(tl: gsap.core.Timeline, el: HTMLElement, to: number, at: number | string) {
  const proxy = { value: 100 };
  return tl.to(proxy, {
    value: to,
    duration: DURATION,
    ease: EASE_NAME,
    onUpdate: () => el.style.setProperty("--cut", `${proxy.value}%`),
  }, at);
}

function rollTitle(el: HTMLElement | null, tl: gsap.core.Timeline, at: number) {
  const wrap = el?.querySelector<HTMLElement>(".page-title");
  const text = el?.querySelector<HTMLElement>(".page-title__text");
  if (!wrap || !text) return;
  gsap.set(wrap, { autoAlpha: 1 });
  gsap.set(text, { yPercent: 100 });
  tl.to(text, { yPercent: 0, duration: DURATION, ease: EASE_NAME }, at);
}

/**
 * The page transition: the outgoing page is copied just before the router swaps
 * the DOM, then both layers run the reference's two-phase wipe — first a shared
 * clip-and-scale that hands the clip from one page to the other, then the
 * resolve to full width.
 *
 * The copy is kept as a string and only materialised once a navigation is
 * confirmed, so a drag that never navigates leaves nothing behind.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const snapshotRef = useRef<{ html: string; scrollY: number } | null>(null);
  const directionRef = useRef<"forward" | "back">("forward");
  const firstRef = useRef(true);
  const guardRef = useRef<number | null>(null);
  const layerRef = useRef<HTMLElement | null>(null);

  // Record the outgoing markup just before the router commits the new route.
  useEffect(() => {
    const capture = (direction: "forward" | "back") => {
      const page = document.querySelector<HTMLElement>("main.page");
      if (!page || page.dataset.transitioning === "true") return;

      directionRef.current = direction;
      snapshotRef.current = {
        html: page.outerHTML,
        scrollY: window.scrollY || 0,
      };

      // If the router never commits (same-path click, blocked navigation),
      // forget the copy so it can never be resurrected.
      if (guardRef.current) window.clearTimeout(guardRef.current);
      guardRef.current = window.setTimeout(() => {
        snapshotRef.current = null;
      }, 1500);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!isInternalLink(event.target)) return;
      const anchor = (event.target as HTMLElement).closest("a")!;
      if (anchor.getAttribute("href") === pathname) return;
      // Capture eagerly. Whether the click actually navigates is decided by
      // whether the pathname changes — a drag that ends on a link is harmless
      // because nothing is ever attached to the DOM speculatively.
      capture("forward");
    };

    const onPop = () => capture("back");

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [pathname]);

  useEffect(
    () => () => {
      if (guardRef.current) window.clearTimeout(guardRef.current);
      layerRef.current?.remove();
    },
    []
  );

  useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    if (guardRef.current) window.clearTimeout(guardRef.current);

    const pending = snapshotRef.current;
    snapshotRef.current = null;

    const next = document.querySelector<HTMLElement>("main.page");

    // Only now, with the navigation confirmed, is the outgoing page materialised.
    let old: HTMLElement | null = null;
    if (pending) {
      const host = document.createElement("div");
      host.innerHTML = pending.html;
      const clone = host.firstElementChild as HTMLElement;
      clone.classList.add("page--snapshot");
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("inert", "");
      clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
      clone.style.position = "fixed";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.width = "100%";
      clone.style.height = "100dvh";
      clone.style.overflow = "hidden";
      clone.style.zIndex = "1";
      clone.style.transformOrigin = "center center";
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);
      old = clone;
      layerRef.current = clone;
    }

    if (!next) {
      old?.remove();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      old?.remove();
      layerRef.current = null;
      return;
    }

    const direction = directionRef.current;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const g = isMobile ? GEOMETRY.mobile : GEOMETRY.desktop;
    const scale = isMobile ? MOBILE_SCALE : SCALE;
    const cut = cutTarget(isMobile);

    document.documentElement.classList.add("is-locked");
    lockScroll(true);
    next.dataset.transitioning = "true";
    window.scrollTo(0, 0);

    // The incoming page is mounted but not yet in flow.
    gsap.set(next, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100dvh",
      overflow: "hidden",
      zIndex: 2,
      xPercent: (direction === "back" ? -1 : 1) * (isMobile ? -F.enterX : 100),
      transformOrigin: "center center",
      pointerEvents: "none",
    });

    const tl = gsap.timeline();

    /* Phase 1 — the hand-off. Both pages shrink and settle onto the clip. */
    if (old) {
      tl.to(old, {
        scale,
        xPercent: isMobile ? -F.oldX : g.oldX,
        duration: DURATION,
        ease: EASE_NAME,
      }, 0);
      tweenCut(tl, old, cut, 0);
    }
    tl.to(next, {
      scale,
      xPercent: isMobile ? g.oldX : g.newXBase,
      duration: DURATION,
      ease: EASE_NAME,
    }, 0);
    tweenCut(tl, next, cut, 0);

    rollTitle(old, tl, 0);
    rollTitle(next, tl, 0);

    /* Phase 2 — the resolve. The old page leaves, the new one fills the frame. */
    const lag = isMobile ? 0 : direction === "back" ? BACK_LAG : FWD_LAG;
    tl.addLabel("resolve", `+=${lag}`);

    if (old) {
      const travel = isMobile ? F.exitTravel : 100;
      const sign = direction === "back" ? 1 : -1;
      tl.to(old, {
        xPercent: () => Number(gsap.getProperty(old, "xPercent")) + sign * travel,
        scale: () => Number(gsap.getProperty(old, "scale")) * (isMobile ? MOBILE_EXIT_SCALE : EXIT_SCALE),
        duration: DURATION,
        ease: EASE_NAME,
      }, "resolve");
    }

    const enterAt = direction !== "back" || isMobile ? "<" : `<+=${ENTER_LAG}`;
    tl.to(next, { xPercent: 0, scale: 1, duration: DURATION, ease: EASE_NAME }, enterAt);
    tweenCut(tl, next, 100, "resolve");

    const nextTitle = next.querySelector<HTMLElement>(".page-title__text");
    if (nextTitle) tl.to(nextTitle, { yPercent: 100, duration: TITLE_DURATION, ease: EASE_NAME }, "<");

    tl.eventCallback("onComplete", () => {
      old?.remove();
      layerRef.current = null;
      gsap.set(next, { clearProps: "all" });
      next.style.removeProperty("--cut");
      next.style.removeProperty("position");
      delete next.dataset.transitioning;
      document.documentElement.classList.remove("is-locked");
      lockScroll(false);
      window.scrollTo(0, 0);
    });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return <>{children}</>;
}
