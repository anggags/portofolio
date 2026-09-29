import { Gallery } from "@/components/gallery";
import { PageTitle } from "@/components/page-title";
import { projects } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="page page--home" id="main">
      <PageTitle>Cases</PageTitle>
      <Gallery projects={projects} />
    </main>
  );
}
