import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import { Rollover } from "@/components/rollover";
import { projects } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="page page--project" id="main">
      <PageTitle>{project.name}</PageTitle>

      <div className="cont project">
        <header className="project-head">
          <h1 className="project-title font-headline-1">{project.name}</h1>
          <div className="project-meta font-body-12 uppercase">
            <div>{project.client}</div>
            <div>{project.discipline}</div>
            <div className="tabular">{project.year}</div>
          </div>
        </header>

        <div
          className="project-hero"
          style={
            { "--tone-a": project.tone[0], "--tone-b": project.tone[1] } as React.CSSProperties
          }
        >
          <div className="img-over" aria-hidden />
        </div>

        <div className="project-body">
          <p className="project-summary font-body-18">{project.summary}</p>
          {project.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="font-body">
              {paragraph}
            </p>
          ))}
        </div>

        <nav className="project-nav" aria-label="Project navigation">
          <span className="font-body-12 uppercase opacity-50">
            Next — {String((index + 1) % projects.length + 1).padStart(2, "0")}
          </span>
          <Link href={`/${next.slug}`} className="font-headline-2">
            <Rollover label={next.name} />
          </Link>
        </nav>
      </div>
    </main>
  );
}
