import { PageTitle, Section } from "@/components/ui/section";
import { experience } from "@/lib/site";

export function Experience() {
  return (
    <Section id="experience">
      <PageTitle>experience</PageTitle>

      <div className="col-span-6 mt-10 flex flex-col md:col-span-14 md:mt-20">
        {experience.map((role, index) => (
          <article
            key={`${role.company}-${role.title}`}
            className="grid border-t border-fg/15 py-6 md:py-8"
          >
            <div className="col-span-6 md:col-span-1">
              <span className="t-label text-fg/40 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="col-span-6 mt-2 md:col-span-4 md:mt-0">
              <h3 className="t-lead">{role.title}</h3>
              <p className="t-label mt-2 text-fg/60">
                {role.company}
                {role.current ? <span className="ml-2 text-fg/40">— current</span> : null}
              </p>
            </div>

            <div className="col-span-6 mt-2 md:col-span-2 md:mt-0">
              <p className="t-label text-fg/50">{role.period}</p>
              <p className="t-label mt-1 text-fg/40">{role.location}</p>
            </div>

            <ul className="col-span-6 mt-5 flex flex-col gap-2 md:col-span-6 md:col-start-9 md:mt-0">
              {role.points.map((point) => (
                <li key={point} className="t-body flex gap-3 text-fg/70">
                  <span aria-hidden className="mt-[0.7em] size-[0.3rem] shrink-0 rounded-full bg-fg/40" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
