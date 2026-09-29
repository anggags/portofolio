import { WorkGallery } from "@/components/work-gallery";
import { PageTitle, Section } from "@/components/ui/section";
import { projects } from "@/lib/site";

export function Work() {
  return (
    <Section id="work">
      <PageTitle>work</PageTitle>

      <div className="col-span-6 mt-8 md:col-span-6 md:col-start-9 md:mt-0">
        <p className="t-label text-fg/60">
          Six selected projects, 2024—2026
        </p>
      </div>

      <div className="col-span-6 mt-10 md:col-span-14 md:mt-16">
        <WorkGallery projects={projects} />
      </div>
    </Section>
  );
}
