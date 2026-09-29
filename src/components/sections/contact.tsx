import { ArrowUpRight } from "lucide-react";
import { CopyEmail } from "@/components/copy-email";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <Section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,black,transparent)]"
      />

      <div className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="font-mono text-xs text-muted-foreground">05 — Contact</span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-3xl text-balance-tight text-3xl leading-[1.1] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Let&apos;s build something{" "}
            <span className="text-muted-foreground">together</span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-lg text-balance-tight text-base leading-relaxed text-muted">
            I&apos;m always happy to talk through a product idea, a performance problem, or a role
            that needs filling. Drop me a line and I&apos;ll reply within a day or two.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-10 flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${site.email}`}>
                {site.email}
                <ArrowUpRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/resume.pdf" target="_blank" rel="noreferrer noopener">
                Résumé
              </a>
            </Button>
          </div>

          <p className="font-mono text-[11px] text-muted-foreground">or copy it directly</p>
          <CopyEmail email={site.email} />
        </Reveal>

        <Reveal delay={0.32} className="mt-12 w-full">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-8 text-sm">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted transition-colors hover:text-foreground"
              >
                {social.label}
                <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                  {social.handle}
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
