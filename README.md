# Portfolio

Personal portfolio built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

A first-visit preloader reveals the header and fans the work gallery open, the
palette follows the visitor's local clock from deep night through sunrise to a
golden dusk, and every internal navigation runs a two-phase clip wipe.

## Stack

| Concern   | Choice                                                          |
| --------- | --------------------------------------------------------------- |
| Framework | Next.js 16 (App Router) + React 19                                |
| Language  | TypeScript 6                                                     |
| Styling   | Tailwind CSS v4 (CSS-first config, design tokens live in CSS)     |
| Type      | `Archivo` via `next/font/google`                                  |
| Smooth    | [`lenis`](https://github.com/darkroomengineering/lenis)            |
| Animation | GSAP 3 + Draggable, DrawSVGPlugin, CustomEase                     |

> **Note:** the spec originally called for `@studio-freight/lenis`, but that
> package was renamed and deprecated upstream. This project uses the official
> successor, `lenis`, which shares the same API.

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

## Routes

| Route      | Rendering | Contents                                     |
| ---------- | --------- | -------------------------------------------- |
| `/`        | static    | Draggable case gallery, animated page title   |
| `/archive` | static    | Full project index                           |
| `/about`   | static    | Bio, experience, capabilities                 |
| `/[slug]`  | SSG       | One page per project, generated at build time |

Project slugs come from `src/lib/site.ts`; `generateStaticParams` prerenders
every one of them.

## Project structure

```
src/
  app/
    layout.tsx            # Archivo, metadata, pre-paint time-theme script
    page.tsx              # home — Cases
    archive/page.tsx      # project index
    about/page.tsx        # bio + experience
    [slug]/page.tsx       # project detail, generated per entry
    globals.css           # tokens, grid, type scale, every component style
  components/
    app-shell.tsx         # persistent chrome + overlay state
    site-header.tsx       # logo, animated mark, nav, time widget
    intro.tsx             # first-visit preloader timeline
    page-transition.tsx   # two-phase clip wipe between routes
    menu-overlay.tsx      # full-screen menu with live previews
    previews.tsx          # miniature Home / Archive / About views
    contact-modal.tsx     # contact form + success state
    gallery.tsx           # draggable, keyboard-navigable work gallery
    time-widget.tsx       # egg time-travel control
    time-provider.tsx     # clock + theme subscription
    rollover.tsx          # shared stacked-text hover effect
    page-title.tsx        # oversized route title
    backdrop.tsx          # shared dim layer
    providers/smooth-scroll.tsx
  lib/
    site.ts               # all content: nav, projects, bio, socials
    time-theme.ts         # background ramp, text steps, pre-paint script
    lenis-registry.ts     # module-level Lenis handle for scroll locking
```

Content lives in `src/lib/site.ts` — edit that file to make the site yours.

## Theming

`src/lib/time-theme.ts` owns the whole palette.

- `BG_STOPS` interpolates the background between clock hours; the text colour
  steps at `0 / 5 / 6 / 19 / 20`.
- Artwork overlays use two channels, `--img-over-opacity` and
  `--img-br-opacity`, so the same gradient artwork works in daylight and after
  dark.
- `TIME_THEME_SCRIPT` is inlined in `layout.tsx` so the first paint already has
  the correct variables — the page never flashes the wrong theme.

Notes on the ramp:

- A mid-tone background cannot reach 4.5:1 against both the light and the dark
  text colour, so the dawn and dusk crossings are compressed into short windows
  rather than spread across a full hour. This is a deliberate fidelity choice:
  the curve matches the reference design.
- Outside those two crossings the page clears WCAG AA. If strict AA matters more
  than matching the reference, darken the background's mid-stop or brighten the
  text colours.

## Page transitions

`page-transition.tsx` cannot animate the outgoing page directly — by the time the
App Router commits a new route, the old DOM is already gone. So the outgoing
`main.page` is captured as markup on link click, and the clone is only
materialised once the pathname has actually changed. A drag that ends on a link
without navigating therefore leaves nothing behind.

The wipe itself is two phases: a shared clip-and-scale that hands the clip from
the outgoing layer to the incoming one, then a resolve to full width, using a
registered `CustomEase`.

## Accessibility notes

- `prefers-reduced-motion` skips the preloader, hands the gallery back to native
  horizontal scrolling with no transform, and makes navigation instant — no
  content is ever left hidden behind an animation.
- The gallery is keyboard operable (`role="region"`, `tabIndex`, arrow keys) and
  its drag offset is clamped to the measured travel on every resize.
- The time widget is a real `role="slider"` with arrow-key support and a visible
  reset; it does not depend on dragging.
- Overlays are `inert` when closed, the contact modal moves focus on open and
  restores it on close, and `Escape` closes both the menu and the modal.
- Clock and theme values come from the inline bootstrap script plus an external
  store subscription, so there are no hydration mismatches.
- Every route is statically prerendered.
