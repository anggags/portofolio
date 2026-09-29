import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/icons";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface",
        "transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-border-strong",
        "hover:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Border glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at 50% 0%, color-mix(in oklab, var(--foreground) 9%, transparent), transparent 70%)",
        }}
      />

      {/* Cover */}
      <div className="relative aspect-16/10 overflow-hidden border-b border-border">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out-expo group-hover:scale-105",
            project.gradient,
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:28px_28px]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-4xl font-medium tracking-tight text-foreground/15 transition-colors duration-500 group-hover:text-foreground/25 sm:text-5xl">
            {project.title.charAt(0)}
          </span>
        </div>
        <span className="absolute right-3 top-3 rounded-full border border-border bg-background/70 px-2 py-0.5 font-mono text-[10px] text-muted backdrop-blur-sm">
          {project.year}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Open ${project.title} live demo`}
            className="mt-0.5 shrink-0 rounded-full border border-border p-1.5 text-muted transition-all duration-300 hover:border-border-strong hover:text-foreground"
          >
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="outline" size="sm">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 border-t border-border pt-4 text-xs">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
          >
            <ArrowUpRight className="size-3.5" />
            Live demo
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
          >
            <GitHubIcon className="size-3.5" />
            Source
          </a>
        </div>
      </div>
    </article>
  );
}
