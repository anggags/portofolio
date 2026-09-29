import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { projects } from "@/lib/site";

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        index="02"
        title="Selected work"
        description="A few things I've designed, built and shipped to production."
      />

      <Reveal
        stagger={0.12}
        y={32}
        className="mt-12 grid gap-5 sm:grid-cols-2"
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </Reveal>
    </Section>
  );
}
