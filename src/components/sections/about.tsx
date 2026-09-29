import { PageTitle, Section } from "@/components/ui/section";
import { site } from "@/lib/site";

const facts = [
  { label: "Location", value: site.location },
  { label: "Role", value: site.role },
  { label: "Experience", value: "6+ years" },
  { label: "Focus", value: "Product engineering" },
];

const disciplines = [
  "01. Interface engineering",
  "02. Design systems",
  "03. Realtime data",
  "04. Performance",
  "05. Accessibility",
  "06. Motion",
];

export function About() {
  return (
    <Section id="about">
      <PageTitle>about</PageTitle>

      <div className="col-span-6 mt-10 md:col-span-6 md:col-start-1 md:mt-16">
        <p className="t-h2 tight">
          <span>I build fast,</span>
          <span>quiet interfaces</span>
          <span>for the web</span>
        </p>
      </div>

      <div className="col-span-6 mt-10 md:col-span-5 md:col-start-9 md:mt-16">
        <div className="flex flex-col gap-5">
          <p className="t-body text-fg/75">
            Six years of shipping products on the web — mostly the unglamorous parts that
            decide whether an interface feels fast, predictable and pleasant to use.
          </p>
          <p className="t-body text-fg/75">
            I care about the whole arc: shaping a design system in Figma, encoding it as
            tokens, wiring the data layer, then obsessively profiling what actually ships.
          </p>
          <p className="t-body text-fg/75">
            Currently leading front-end for a realtime analytics product at{" "}
            <span className="text-fg">Nimbus Labs</span>.
          </p>
        </div>
      </div>

      <div className="col-span-6 mt-16 md:col-span-5 md:col-start-1 md:mt-28">
        <h3 className="t-label mb-6 text-fg/50">What I do</h3>
        <ol className="flex flex-col">
          {disciplines.map((item) => (
            <li
              key={item}
              className="t-label border-t border-fg/15 py-3 transition-colors duration-300 hover:text-fg/100"
            >
              {item}
            </li>
          ))}
        </ol>
      </div>

      <div className="col-span-6 mt-16 md:col-span-5 md:col-start-9 md:mt-28">
        <h3 className="t-label mb-6 text-fg/50">Details</h3>
        <dl className="flex flex-col">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-6 border-t border-fg/15 py-3">
              <dt className="t-label text-fg/50">{fact.label}</dt>
              <dd className="t-label text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
