import Link from "next/link";
import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";
import { Rollover } from "@/components/rollover";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Archive",
  description: `Every ${site.firstName} ${site.lastName} project, in one place.`,
};

export default function ArchivePage() {
  return (
    <main className="page page--archive" id="main">
      <PageTitle>Archive</PageTitle>

      <div className="cont archive">
        <header className="archive-head">
          <p className="font-body-12 uppercase opacity-50">
            {projects.length} Projects — 2016 to now
          </p>
        </header>

        <ul className="archive-list">
          {projects.map((project, index) => (
            <li key={project.slug} className="archive-row">
              <Link href={`/${project.slug}`} className="archive-link">
                <span className="archive-index tabular font-body-12">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="archive-name font-headline-2">
                  <Rollover label={project.name} />
                </span>
                <span className="archive-meta font-body-12 uppercase">
                  {project.discipline}
                </span>
                <span className="archive-year tabular font-body-12">
                  {project.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
