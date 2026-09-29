import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TimelineLine } from "@/components/sections/timeline-line";
import { experience } from "@/lib/site";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        index="03"
        title="Experience"
        description="Where I've worked and what I was responsible for."
      />

      <div className="relative mt-12 pl-8 md:pl-12">
        <TimelineLine />

        <Reveal as="ol" stagger={0.14} y={28} className="flex flex-col gap-12">
          {experience.map((role) => (
            <li key={`${role.company}-${role.title}`} className="relative">
              {/* Node */}
              <span
                aria-hidden
                className={`absolute top-1.5 -left-8 flex size-4 items-center justify-center rounded-full border bg-background md:-left-12 ${
                  role.current ? "border-foreground/40" : "border-border"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    role.current ? "animate-pulse-dot bg-emerald-500" : "bg-border-strong"
                  }`}
                />
              </span>

              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{role.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {role.company}
                    {role.current ? (
                      <span className="ml-2 rounded-full border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        Current
                      </span>
                    ) : null}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {role.period} · {role.location}
                </p>
              </div>

              <ul className="mt-4 space-y-2.5">
                {role.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-border-strong" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
