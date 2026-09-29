import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/lib/site";

const facts = [
  { label: "Location", value: site.location },
  { label: "Role", value: site.role },
  { label: "Experience", value: "6+ years" },
  { label: "Focus", value: "Product engineering" },
];

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        index="01"
        title="About"
        description="A short version of the long version."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <Reveal className="space-y-5 text-base leading-relaxed text-muted">
          <p>
            I&apos;ve spent the last six years building products on the web — mostly the
            unglamorous parts that decide whether an interface feels fast, predictable and
            genuinely pleasant to use.
          </p>
          <p>
            I care about the whole arc: shaping a design system in Figma, encoding it as tokens,
            wiring up the data layer, and then obsessively profiling what actually ships. Motion
            is part of that — used to explain change, never to decorate it.
          </p>
          <p>
            These days I&apos;m at <span className="text-foreground">Nimbus Labs</span>, leading
            front-end for a realtime analytics product. Outside work I maintain a handful of open
            source tools and write about rendering performance.
          </p>
        </Reveal>

        <Reveal stagger={0.08} className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border self-start">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-surface p-5">
              <dt className="font-mono text-[11px] tracking-tight text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm leading-snug font-medium">{fact.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
