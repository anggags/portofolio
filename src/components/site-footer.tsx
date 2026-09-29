import { ArrowUp } from "lucide-react";
import { LocalTime } from "@/components/local-time";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-fg/15 py-8">
      <div className="shell">
        <div className="grid items-center">
          <p className="col-span-6 t-label text-fg/60 md:col-span-6">
            &copy; {new Date().getFullYear()} {site.name}
          </p>

          <p className="col-span-6 t-label mt-2 text-fg/40 md:col-span-4 md:col-start-5 md:mt-0">
            <LocalTime timezone={site.timezone} />
          </p>

          <p className="col-span-6 t-label mt-2 text-fg/40 md:col-span-6 md:col-start-9 md:mt-0">
            {site.location}
          </p>

          <div className="col-span-6 mt-4 flex justify-end md:col-span-2 md:col-start-13 md:mt-0">
            <a
              href="#top"
              aria-label="Back to top"
              className="t-label inline-flex items-center gap-2 text-fg/60 transition-colors hover:text-fg"
            >
              Top
              <ArrowUp className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
