import { ArrowUp } from "lucide-react";
import { LocalTime } from "@/components/local-time";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5 font-medium tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface font-mono text-xs">
            {site.monogram}
          </span>
          {site.name}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            {site.location}
            <span className="text-border-strong">/</span>
            <LocalTime timezone={site.timezone} />
          </span>
          <span>&copy; {new Date().getFullYear()} {site.name}</span>
          <span>Built with Next.js &amp; Tailwind</span>
        </div>

        <a
          href="#top"
          aria-label="Back to top"
          className="group inline-flex size-9 items-center justify-center self-start rounded-full border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground md:self-auto"
        >
          <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
