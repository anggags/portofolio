# Portfolio

Personal portfolio built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.
Minimalist dark-first design with a full light mode, GSAP-driven scroll animations
and butter-smooth scrolling.

## Stack

| Concern    | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack) + React 19               |
| Language   | TypeScript 6                                                |
| Styling    | Tailwind CSS v4 (CSS-first config, design tokens in CSS)    |
| Smooth     | [`lenis`](https://github.com/darkroomengineering/lenis)     |
| Animation  | GSAP + ScrollTrigger, Framer Motion                         |
| Icons      | `lucide-react` + inline brand SVGs                          |
| Theme      | `next-themes` (class strategy, dark default)                |
| Utils      | `clsx` + `tailwind-merge` + `class-variance-authority`      |

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
    layout.tsx          # fonts, providers, metadata
    page.tsx            # section composition
    globals.css         # design tokens + Tailwind theme
    icon.svg            # favicon
  components/
    providers/          # theme provider, Lenis smooth scroll
    sections/           # hero, about, projects, experience, skills, contact
    ui/                 # button, badge, section, section-header, reveal
    icons.tsx           # brand marks removed from lucide v1
    project-card.tsx
    site-header.tsx
    site-footer.tsx
    copy-email.tsx
    local-time.tsx
    theme-toggle.tsx
  lib/
    site.ts             # all content: nav, projects, roles, skills
    utils.ts            # cn() helper
```

Content lives in `src/lib/site.ts` — edit that file to make the site yours.

## Theming

Tokens are CSS custom properties defined in `src/app/globals.css` and mapped into
Tailwind via `@theme inline`, so a single variable change re-themes the whole site.

Dark palette: background `#09090b`, surface `#121215`, border `#27272a`,
text `#f4f4f5`, muted `#a1a1aa`. Light mode is a full inversion of the same tokens.

## Accessibility & performance notes

- `prefers-reduced-motion` disables Lenis and every GSAP entrance animation, so no
  content is ever left hidden.
- Theme-dependent and clock-dependent UI uses `useSyncExternalStore` /
  `suppressHydrationWarning` to avoid hydration mismatches.
- The page is fully statically prerendered.
