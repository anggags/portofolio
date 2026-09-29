"use client";

import { useState } from "react";
import { projects, about, site } from "@/lib/site";

/**
 * Live, interactive miniatures shown behind the menu links — not screenshots.
 * The archive preview is a working list, the about preview is a working
 * headline block, so hovering a menu link previews the real thing.
 */

export function ArchivePreview() {
  const [active, setActive] = useState(0);

  return (
    <div className="preview-archive">
      <div className="preview-archive__count font-body-12 uppercase tabular">
        {projects.length} Projects — 2016 to now
      </div>
      <ul className="preview-archive__list">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            onMouseEnter={() => setActive(index)}
            className={index === active ? "is-active" : undefined}
          >
            <span className="tabular">{String(index + 1).padStart(2, "0")}</span>
            <span className="preview-archive__name">{project.name}</span>
            <span className="tabular">{project.year}</span>
          </li>
        ))}
      </ul>
      <div className="preview-archive__stage" aria-hidden>
        <div
          className="preview-archive__art"
          style={
            {
              "--tone-a": projects[active].tone[0],
              "--tone-b": projects[active].tone[1],
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

export function AboutPreview() {
  return (
    <div className="preview-about">
      <p className="preview-about__headline font-headline-2">{about.headline}</p>
      <p className="preview-about__body font-body-12">{about.paragraphs[0]}</p>
      <ul className="preview-about__facts">
        {about.facts.map((fact) => (
          <li key={fact.label}>
            <span className="uppercase opacity-50">{fact.label}</span>
            <span>{fact.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomePreview() {
  return (
    <div className="preview-home">
      <p className="preview-home__title font-headline-1">Cases</p>
      <p className="preview-home__meta font-body-12 uppercase">{site.role}</p>
    </div>
  );
}
