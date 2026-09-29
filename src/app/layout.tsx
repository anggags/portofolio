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
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${fullName} — ${site.role}`,
    template: `%s — ${fullName}`,
  },
  description: site.description,
  keywords: ["portfolio", "full-stack engineer", "next.js", "typescript", "design systems"],
  authors: [{ name: fullName }],
  openGraph: {
    type: "website",
    title: `${fullName} — ${site.role}`,
    description: site.description,
    siteName: fullName,
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
    <html lang="en" className={archivo.variable}>
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
