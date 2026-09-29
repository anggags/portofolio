# Portfolio

Personal portfolio built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.
The palette follows the visitor's local clock — it shifts from deep night through a
warm sunrise, a light midday and a golden dusk — and selected work sits in a
GSAP-driven horizontal gallery.

## Stack

| Concern   | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack) + React 19                  |
| Language  | TypeScript 6                                                   |
| Styling   | Tailwind CSS v4 (CSS-first config, design tokens in CSS)       |
| Type      | `Archivo` via `next/font/google`                              |
| Smooth    | [`lenis`](https://github.com/darkroomengineering/lenis)        |
| Animation | GSAP + Draggable (work gallery, hero entrance, rollovers)      |
| Utils     | `clsx` + `tailwind-merge`                                      |

> **Note:** the spec called for `@studio-freight/lenis`, but that package was
> renamed and deprecated upstream. This project uses the official successor,
> `lenis`, which shares the same API.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
src/
  app/
    layout.tsx          # Archivo, metadata, inline time-theme bootstrap
    page.tsx            # section composition
    globals.css         # time tokens, 6/14-col grid, type scale
    icon.svg            # favicon
  components/
    clock.tsx           # per-second theme driver + time travel
    work-gallery.tsx    # DragScroll + keyboard, progress bar
    sections/           # hero, work, about, experience, skills, contact
    ui/section.tsx      # Section + PageTitle grid wrappers
    site-header.tsx
    site-footer.tsx
  lib/
    site.ts             # all content: nav, projects, roles, skills
    time-theme.ts       # background ramp + text steps
    utils.ts            # cn() helper
```

Content lives in `src/lib/site.ts` — edit that file to make the site yours.

## Theming

`src/lib/time-theme.ts` holds the whole palette. `BG_STOPS` interpolates the
background per RGB channel between clock hours; `TEXT_STEPS` switches the text
colour at the dawn and dusk boundaries. The same module exports an inline script
string that is injected before paint in `layout.tsx`, so the page never flashes
the wrong theme.

Notes on the ramp:

- A mid-tone background (relative luminance roughly 0.065–0.20) cannot reach
  4.5:1 against either the light or the dark text colour. The dawn and dusk
  crossings are therefore compressed into short windows rather than spread across
  an hour. Outside them the whole page clears WCAG AA.
- Remaining worst case is about 3.1:1 for roughly 45 minutes a day at the two
  crossings — the theoretical floor for a two-colour text palette over a
  continuous ramp. Lower the background's mid-stop darkness or brighten the text
  colours if you need AA at every minute.

## Accessibility notes

- `prefers-reduced-motion` disables Lenis and every GSAP entrance animation, and
  hands the work gallery back to native horizontal scrolling with no transform,
  so no content is ever left hidden.
- The gallery is keyboard operable (`role="region"`, `tabIndex`, arrow keys) and
  its drag offset is clamped to the measured travel on every resize.
- Theme and clock values update from the inline bootstrap script and a
  `useSyncExternalStore` subscription, avoiding hydration mismatches.
- The page is fully statically prerendered.
