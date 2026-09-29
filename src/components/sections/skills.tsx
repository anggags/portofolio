import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { skillGroups } from "@/lib/site";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        index="04"
        title="Skills & arsenal"
        description="The tools I reach for most, updated as the ecosystem shifts."
      />

      <Reveal stagger={0.1} y={26} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => (
          <div key={group.category} className="bg-surface p-6">
            <h3 className="font-mono text-[11px] tracking-tight text-muted-foreground">
              {group.category}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item}>
                  <Badge size="sm" className="transition-colors duration-300 hover:border-border-strong hover:text-foreground">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
