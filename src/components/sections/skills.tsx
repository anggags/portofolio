import { PageTitle, Section } from "@/components/ui/section";
import { skillGroups } from "@/lib/site";

export function Skills() {
  return (
    <Section id="skills">
      <PageTitle>toolkit</PageTitle>

      {skillGroups.map((group) => (
        <div
          key={group.category}
          className="col-span-6 mt-10 border-t border-fg/15 py-5 md:col-span-14 md:mt-0 md:py-6"
        >
          <div className="grid items-baseline">
            <h3 className="col-span-6 t-label text-fg/50 md:col-span-6 md:col-start-1">
              {group.category}
            </h3>
            <ul className="col-span-6 mt-3 flex flex-wrap gap-x-6 gap-y-1 md:col-span-10 md:col-start-5 md:mt-0 md:justify-end">
              {group.items.map((item) => (
                <li key={item} className="t-label text-fg transition-opacity duration-300 hover:opacity-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </Section>
  );
}
