/* ---------------------------------------------------------------------------
   All site content. Edit this file to make the site yours.

   Project artwork is placeholder: each case carries a `tone` pair that the
   gallery turns into a gradient, so the layout and motion can be judged without
   shipping third-party imagery.
--------------------------------------------------------------------------- */

export type Project = {
  slug: string;
  name: string;
  year: string;
  client: string;
  discipline: string;
  summary: string;
  body: string[];
  /** gradient stops for the placeholder artwork */
  tone: [string, string];
};

export const site = {
  firstName: "Angga",
  lastName: "S",
  role: "Full-stack Engineer & Interface Designer",
  timezone: "Asia/Jakarta",
  email: "hello@angga.dev",
  description:
    "Brand, digital and product work — interfaces that stay fast and legible as they grow. Currently building design systems and frontend architecture.",
  socials: [
    { label: "Email", href: "mailto:hello@angga.dev" },
    { label: "GitHub", href: "https://github.com/anggags" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
  ],
};

export const navLinks = [
  { label: "Menu", href: "/#menu" },
  { label: "Archive", href: "/archive" },
  { label: "About", href: "/about" },
];

export const projects: Project[] = [
  {
    slug: "kiln",
    name: "Kiln",
    year: "2026",
    client: "Kiln Studio",
    discipline: "Identity, Web",
    summary:
      "A ceramics studio brand and storefront built around a single grid, so every product shot lands on the same optical rhythm.",
    body: [
      "Kiln wanted a site that could carry a growing catalogue without turning into a grid of mismatched thumbnails. We built the layout on a fixed 14-column grid and let the imagery do the variation.",
      "The storefront renders from a static snapshot, so the first paint is complete before any client JavaScript runs.",
    ],
    tone: ["#3E2F26", "#8C6A4F"],
  },
  {
    slug: "signal-relay",
    name: "Signal Relay",
    year: "2026",
    client: "Relay Labs",
    discipline: "Product, Design System",
    summary:
      "An observability console where the whole interface is generated from one token set, shipped as CSS variables and a typed source.",
    body: [
      "Every colour, radius and step in the console comes from a single token graph. Changing the theme at runtime touches six variables, not six hundred rules.",
      "Dense tables stay readable at 1440px and collapse to a single column without a separate mobile stylesheet.",
    ],
    tone: ["#1F2A33", "#4E6E82"],
  },
  {
    slug: "nine-furniture",
    name: "Nine",
    year: "2025",
    client: "Nine Furniture",
    discipline: "Web, Motion",
    summary:
      "A catalogue for a furniture maker where the only motion is the picture — every transition hands off to the image, never the chrome.",
    body: [
      "Nine asked for restraint. The site has one transition primitive, a wipe, and it is used for every route change so the product imagery never jumps.",
      "Scroll is driven by a single virtual-scroll instance that is disabled wholesale under reduced-motion.",
    ],
    tone: ["#2B2B26", "#6E6A5C"],
  },
  {
    slug: "northbound",
    name: "Northbound",
    year: "2025",
    client: "Northbound Freight",
    discipline: "Brand, Web",
    summary:
      "A logistics brand that had to feel precise in a browser, including at the exact moment the sun sets over the Baltic.",
    body: [
      "The palette is derived from the visitor's clock rather than a theme toggle, so the site is never a flat slab of one colour.",
      "Artwork carries a time-linked overlay that keeps it legible as the page darkens toward night.",
    ],
    tone: ["#22303A", "#6C8794"],
  },
  {
    slug: "field-notes",
    name: "Field Notes",
    year: "2025",
    client: "Self-initiated",
    discipline: "Editorial",
    summary:
      "A long-form publishing experiment: one column, one measure, and a type scale that does all the work.",
    body: [
      "No grid, no gallery, no JavaScript beyond a font loader. Just a measure that holds between 60 and 72 characters at every viewport.",
      "The whole thing prerenders to static HTML and scores in the high nineties on a throttled connection.",
    ],
    tone: ["#3B322B", "#9A8A73"],
  },
  {
    slug: "harbour",
    name: "Harbour",
    year: "2024",
    client: "Harbour Ventures",
    discipline: "Product, Web",
    summary:
      "An early-stage fund site built to be edited by non-engineers, shipping a new portfolio page without a deploy.",
    body: [
      "Content is a typed module the client edits directly. The build fails loudly if a project is missing an image or a date.",
      "The archive page renders every past investment, which turned out to be the most-visited part of the site.",
    ],
    tone: ["#24333A", "#54757F"],
  },
];

export const about = {
  headline: "Engineer by trade, designer by compulsion.",
  paragraphs: [
    "I build interfaces for the web and the systems behind them. Most of my work sits where a design system meets production code — the part where a beautiful spec has to survive real content, real data and a real deadline.",
    "I care about the boring details: type that renders on the first frame, layout that does not shift, motion that respects a reduced-motion preference, and a site that is still readable on a slow connection.",
    "Away from the screen I photograph buildings, collect mid-century print, and keep trying to make a good cup of coffee.",
  ],
  facts: [
    { label: "Based", value: "Jakarta, working globally" },
    { label: "Focus", value: "Design systems, frontend architecture" },
    { label: "Since", value: "2016" },
  ],
  capabilities: [
    "Design systems and token architecture",
    "Frontend architecture and performance",
    "Motion, transitions and interaction detail",
    "Accessibility and reduced-motion paths",
  ],
  experience: [
    {
      company: "Independent",
      title: "Engineer & Designer",
      period: "2021 — now",
      location: "Remote",
      points: [
        "Design systems and frontend architecture for product teams.",
        "Build-tooling and performance work on content-heavy sites.",
      ],
    },
    {
      company: "Studio Nine",
      title: "Senior Frontend Engineer",
      period: "2018 — 2021",
      location: "Jakarta",
      points: [
        "Led the rebuild of a commerce platform to a static-first architecture.",
        "Introduced an accessibility review gate to the delivery process.",
      ],
    },
    {
      company: "K Agency",
      title: "Frontend Developer",
      period: "2016 — 2018",
      location: "Bandung",
      points: [
        "Campaign and editorial builds for brand and fashion clients.",
        "Built the studio's shared component library.",
      ],
    },
  ],
};
