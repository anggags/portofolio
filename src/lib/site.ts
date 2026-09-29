export const site = {
  name: "Angga",
  monogram: "AG",
  role: "Full-Stack Engineer",
  email: "hello@angga.dev",
  availability: "Available for work",
  location: "Jakarta, Indonesia",
  timezone: "Asia/Jakarta",
  description:
    "Full-stack engineer crafting fast, accessible interfaces with a soft spot for motion, typography and design systems.",
  socials: [
    { label: "GitHub", href: "https://github.com/anggags", handle: "@anggags" },
    { label: "LinkedIn", href: "https://linkedin.com/in/anggags", handle: "/in/anggags" },
    { label: "X", href: "https://x.com/anggags", handle: "@anggags" },
  ],
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export type Project = {
  title: string;
  description: string;
  tech: string[];
  href: string;
  repo: string;
  year: string;
  featured?: boolean;
  gradient: string;
};

export const projects: Project[] = [
  {
    title: "Nebula Analytics",
    description:
      "Realtime product analytics dashboard streaming millions of events with sub-second queries and composable chart primitives.",
    tech: ["Next.js", "TypeScript", "ClickHouse", "D3"],
    href: "https://example.com/nebula",
    repo: "https://github.com/anggags/nebula",
    year: "2026",
    featured: true,
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  },
  {
    title: "Terminal Portfolio",
    description:
      "A command-palette driven developer portfolio rendered as a live shell, complete with fuzzy search and keyboard navigation.",
    tech: ["React", "Tailwind", "xterm.js", "GSAP"],
    href: "https://example.com/terminal",
    repo: "https://github.com/anggags/terminal-portfolio",
    year: "2025",
    featured: true,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    title: "Ledgerly",
    description:
      "Double-entry bookkeeping engine with optimistic mutations, immutable audit trail and CSV reconciliation for small teams.",
    tech: ["Node.js", "PostgreSQL", "tRPC", "Stripe"],
    href: "https://example.com/ledgerly",
    repo: "https://github.com/anggags/ledgerly",
    year: "2025",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "Orbit Docs",
    description:
      "Static-first documentation platform with MDX, incremental static regeneration and offline search that works without a network.",
    tech: ["Next.js", "MDX", "Fuse.js", "Vercel"],
    href: "https://example.com/orbit",
    repo: "https://github.com/anggags/orbit-docs",
    year: "2024",
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  points: string[];
  current?: boolean;
};

export const experience: Role[] = [
  {
    company: "Nimbus Labs",
    title: "Senior Frontend Engineer",
    period: "2024 — Present",
    location: "Jakarta · Hybrid",
    current: true,
    points: [
      "Led the migration of a 40-screen product surface to Next.js App Router, cutting median page load by 46%.",
      "Built a token-driven design system adopted by six product squads and shipped as an internal npm package.",
      "Introduced visual regression and interaction budgets to CI, dropping UI regressions by a third quarter-over-quarter.",
    ],
  },
  {
    company: "Studio Koru",
    title: "Full-Stack Engineer",
    period: "2022 — 2024",
    location: "Jakarta · On-site",
    points: [
      "Shipped 14 client products end to end, from Postgres schema to pixel-perfect front end.",
      "Replaced a legacy REST monolith with a typed tRPC layer, removing an entire class of contract bugs.",
      "Set up preview environments per pull request, taking review cycles from days to hours.",
    ],
  },
  {
    company: "Freelance",
    title: "Independent Developer",
    period: "2020 — 2022",
    location: "Remote",
    points: [
      "Delivered marketing sites and web apps for 20+ founders and small studios across APAC.",
      "Specialised in motion-heavy interfaces and performance budgets under a 100KB critical path.",
    ],
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP"],
  },
  {
    category: "Backend",
    items: ["Node.js", "PostgreSQL", "tRPC", "Prisma", "Redis", "REST"],
  },
  {
    category: "Tools & DevOps",
    items: ["Git", "Docker", "Vercel", "GitHub Actions", "Playwright", "Bun"],
  },
  {
    category: "Design",
    items: ["Figma", "Design Tokens", "Framer", "Blender", "Typography"],
  },
];
