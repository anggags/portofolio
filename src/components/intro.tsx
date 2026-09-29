"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(DrawSVGPlugin, CustomEase);

/* All timings below match the reference intro. */
const LOGO_EASE = "power2.out";
const STAGGER = 0.06;
const LOGO_LAG = 0.225;
const NAV_LAG = 1.2;

const SLOW_START = "gallerySlowStart";
const REVEAL = "galleryReveal";
const GALLERY_STAGGER = [0, 0.76, 1.3, 1.58];
const CLIP_DURATION = 1.3;
const ITEM_COUNT = 4;

/* The "logo" label sits at 0, so the gallery reveal is simply an offset from it. */
const GALLERY_AT = 1.65;

const ZERO_CLIP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
const FULL_CLIP = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

for (const [name, points] of [
  [SLOW_START, "0.9, 0, 0.58, 1"],
  [REVEAL, "0.46, 0, 0.09, 1"],
] as const) {
  if (!CustomEase.get(name)) CustomEase.create(name, points);
}

const q = <T extends Element>(selector: string) => Array.from(document.querySelectorAll<T>(selector));

/**
 * The first-load sequence. Everything starts hidden by CSS (`.header--intro`
 * and the zero-height stage clip), so the timeline only ever reveals.
 *
 * Header: the logo rolls up, the mark draws itself stroke by stroke, then the
 * nav, clock and egg ring follow, and finally the stacked gallery fans open.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    // Hand the hidden state over from the CSS flash guard to GSAP. This runs in
    // the same tick as the initial `gsap.set` calls below, so nothing is ever
    // painted half-revealed.
    document.documentElement.classList.add("is-intro-live");

    const finish = () => {
      document.documentElement.classList.remove("is-intro");
      document.documentElement.classList.remove("is-intro-live");
      onDone();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem("portfolio:intro") === "1";

    // Only the very first visit of a session gets the full sequence.
    if (reduced || seen) {
      finish();
      return;
    }

    const mark = document.querySelector<SVGElement>("[data-mark]");
    const markPaths = mark ? Array.from(mark.querySelectorAll("path")) : [];
    const markVisible = mark ? window.getComputedStyle(mark).display !== "none" : false;

    const logoRolls = q<HTMLElement>(".logo .roll > span:first-child");
    const navRolls = q<HTMLElement>(".nav .link .roll > span:first-child");
    const timeEls = q<HTMLElement>(".time-toggle, .time-time, .time-contact");
    const eggRing = document.querySelector<SVGElement>(".egg-svg circle");
    const eggHandle = document.querySelector<HTMLElement>(".rotate");
    const pageTitle = document.querySelector<HTMLElement>(".page-title__text");

    const items = q<HTMLElement>(".gallery-item");
    const stages = items
      .map((item) => item.querySelector<HTMLElement>(".img-wrap"))
      .filter((el): el is HTMLElement => Boolean(el));
    const artworks = q<HTMLElement>(".gallery-item .artwork");
    const names = q<HTMLElement>(".gallery-item .gallery-item-info");

    const count = Math.min(ITEM_COUNT, stages.length);
    const staged = stages.slice(0, count);
    const unstaged = stages.slice(count);

    const tl = gsap.timeline({ onComplete: finish });

    /* Initial state. */
    if (markPaths.length) gsap.set(markPaths, { drawSVG: "0%" });
    if (logoRolls.length) gsap.set(logoRolls, { yPercent: 100 });
    if (navRolls.length) gsap.set(navRolls, { yPercent: 100 });
    if (timeEls.length) gsap.set(timeEls, { yPercent: 100 });
    if (eggRing) gsap.set(eggRing, { drawSVG: "0%" });
    if (eggHandle) gsap.set(eggHandle, { autoAlpha: 0, rotation: 0 });
    if (pageTitle) gsap.set(pageTitle, { yPercent: 100 });
    // Only the staged items are animated closed. The rest must stay visible,
    // so they are dimmed instead of clipped and restored when the fan settles.
    if (staged.length) gsap.set(staged, { clipPath: ZERO_CLIP });
    if (unstaged.length) gsap.set(unstaged, { autoAlpha: 0 });
    if (artworks.length) gsap.set(artworks, { scale: 1.5 });

    /* Logo. */
    tl.addLabel("logo", 0).to(logoRolls, {
      yPercent: 0,
      duration: 1,
      stagger: STAGGER,
      ease: LOGO_EASE,
    }, "logo");

    if (markVisible) {
      markPaths.forEach((path, i) => {
        tl.to(path, {
          drawSVG: "100%",
          duration: i === 0 ? 1.3 : i === 1 ? 0.6 : 0.4,
          ease: "power1.inOut",
        }, i === 0 ? `logo+=${LOGO_LAG}` : "-=0.15");
      });
    }

    tl.addLabel("nav", `logo+=${NAV_LAG}`)
      .to(navRolls, {
        yPercent: 0,
        duration: 1,
        stagger: STAGGER,
        ease: LOGO_EASE,
      }, "nav")
      .to(timeEls, {
        yPercent: 0,
        duration: 1,
        stagger: STAGGER,
        ease: LOGO_EASE,
      }, `<+=${LOGO_LAG}`);

    if (eggRing) {
      tl.to(eggRing, { drawSVG: "100%", duration: 1, ease: "power1.inOut" }, `<+=${LOGO_LAG}`);
    }

    if (pageTitle) {
      const titleWrap = pageTitle.closest<HTMLElement>(".page-title");
      if (titleWrap) gsap.set(titleWrap, { autoAlpha: 1 });
      tl.to(pageTitle, { yPercent: 0, duration: 1.2, ease: LOGO_EASE }, GALLERY_AT);
    }

    /* Gallery: items sit stacked at the centre and open one after another. */
    if (count) {
      const centreX = window.innerWidth / 2;
      const centreY = window.innerHeight / 2;

      const offsets = items.slice(0, count).map((item) => {
        const rect = item.getBoundingClientRect();
        return {
          x: centreX - (rect.left + rect.width / 2),
          y: centreY - (rect.top + rect.height / 2),
        };
      });

      gsap.set(staged, {
        x: (i: number) => offsets[i].x,
        y: (i: number) => offsets[i].y,
        scale: 1,
      });
      gsap.set(artworks.slice(0, count), { scale: 1.5 });

      // The reveal lives on the main timeline so onComplete genuinely means
      // "everything has landed" — the header must not go interactive while the
      // gallery is still fanning open.
      tl.to(artworks.slice(0, count), { scale: 1.2, duration: 0 }, GALLERY_AT);

      for (let i = 0; i < count; i++) {
        tl.to(
          staged[i],
          {
            clipPath: FULL_CLIP,
            duration: CLIP_DURATION,
            ease: REVEAL,
            onComplete: () => gsap.set(staged[i], { clipPath: "none" }),
          },
          GALLERY_AT + GALLERY_STAGGER[count - 1 - i]
        );
      }

      if (names.length) {
        tl.fromTo(
          names,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.8, stagger: STAGGER, ease: LOGO_EASE },
          GALLERY_AT + 0.76
        );
      }

      // Fan back out to the resting position, then hand every stage back to CSS.
      tl.to(staged, { x: 0, y: 0, scale: 1, duration: 1.6, ease: SLOW_START }, GALLERY_AT + CLIP_DURATION);
      tl.call(
        () => {
          gsap.set(stages, { clipPath: "none" });
          if (unstaged.length) gsap.set(unstaged, { autoAlpha: 1 });
        },
        [],
        GALLERY_AT + CLIP_DURATION + 1.6
      );
    }

    /* The egg handle fades in last and settles to its resting angle. */
    if (eggHandle) {
      const resting = Number(gsap.getProperty(eggHandle, "rotation")) || 0;
      tl.fromTo(eggHandle, { rotation: 0 }, {
        autoAlpha: 1,
        rotation: resting,
        duration: 1,
        ease: LOGO_EASE,
      }, GALLERY_AT);
    }

    tl.call(() => {
      window.sessionStorage.setItem("portfolio:intro", "1");
      document.querySelectorAll<HTMLElement>(".header .link").forEach((el) => {
        el.style.pointerEvents = "auto";
      });
    });

    return () => {
      tl.kill();
      document.documentElement.classList.remove("is-intro-live");
    };
  }, [onDone]);

  return null;
}
