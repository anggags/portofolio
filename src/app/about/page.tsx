import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";
import { Rollover } from "@/components/rollover";
import { about, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: about.headline,
};

export default function AboutPage() {
  return (
    <main className="page page--about" id="main">
      <PageTitle>About</PageTitle>

      <div className="cont about">
        <h1 className="about-headline font-headline-2-large">{about.headline}</h1>

        <div className="about-body">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="font-body-18">
              {paragraph}
            </p>
          ))}
        </div>

        <dl className="about-facts">
          {about.facts.map((fact) => (
            <div key={fact.label} className="about-fact">
              <dt className="font-body-12 uppercase opacity-50">{fact.label}</dt>
              <dd className="font-body-12">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section className="about-section" aria-labelledby="capabilities">
          <h2 id="capabilities" className="about-section__title font-body-12 uppercase">
            Capabilities
          </h2>
          <ul className="about-capabilities">
            {about.capabilities.map((item) => (
              <li key={item} className="font-body-18">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="about-section" aria-labelledby="experience">
          <h2 id="experience" className="about-section__title font-body-12 uppercase">
            Experience
          </h2>
          <ul className="about-experience">
            {about.experience.map((role) => (
              <li key={`${role.company}-${role.period}`} className="about-role">
                <div className="about-role__head">
                  <span className="about-role__company font-headline-2">
                    <Rollover label={role.company} />
                  </span>
                  <span className="about-role__title font-body-12 uppercase">
                    {role.title}
                  </span>
                </div>
                <div className="about-role__meta font-body-12 uppercase opacity-50">
                  <span>{role.period}</span>
                  <span>{role.location}</span>
                </div>
                <ul className="about-role__points">
                  {role.points.map((point) => (
                    <li key={point} className="font-body-12">
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <footer className="about-footer">
          <a href={`mailto:${site.email}`} className="link font-body-12 uppercase">
            <Rollover label={site.email} />
          </a>
        </footer>
      </div>
    </main>
  );
}
