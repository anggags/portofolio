import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

import { AppShell } from "@/components/app-shell";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { site } from "@/lib/site";
import { TIME_THEME_SCRIPT } from "@/lib/time-theme";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const fullName = `${site.firstName} ${site.lastName}`;

/** Runs in <head> so the intro's hidden state is set before the body paints. */
const INTRO_BOOTSTRAP = "document.documentElement.classList.add('is-intro');";

export const metadata: Metadata = {
  // Drives canonical + og:url. Set NEXT_PUBLIC_SITE_URL per environment.
  metadataBase: new URL(site.url),
  title: {
    default: `${fullName} — ${site.role}`,
    template: `%s — ${fullName}`,
  },
  description: site.description,
  keywords: ["portfolio", "full-stack engineer", "next.js", "typescript", "design systems"],
  authors: [{ name: fullName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${fullName} — ${site.role}`,
    description: site.description,
    siteName: fullName,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${fullName} — ${site.role}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The two scripts below deliberately mutate <html> before React hydrates:
    // the theme to avoid a colour flash, the intro flag to avoid showing the
    // header before the preloader has run. React would otherwise see a
    // className/style mismatch, log a hydration error and re-render the whole
    // tree — which restarts the intro and re-hides everything it revealed.
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Runs before first paint so the time theme never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: TIME_THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
      </head>
      <body>
        <SmoothScroll>
          <AppShell>{children}</AppShell>
        </SmoothScroll>
      </body>
    </html>
  );
}
