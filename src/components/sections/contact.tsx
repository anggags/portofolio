"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageTitle, Section } from "@/components/ui/section";
import { site } from "@/lib/site";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      const el = document.createElement("textarea");
      el.value = site.email;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${site.email} to clipboard`}
      className="t-label group inline-flex items-center gap-2 border-b border-fg/30 pb-1 transition-colors hover:border-fg"
    >
      <span className={copied ? "text-fg" : "text-fg/50"}>
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </span>
      {site.email}
    </button>
  );
}

export function Contact() {
  return (
    <Section id="contact">
      <PageTitle>contact</PageTitle>

      <div className="col-span-6 mt-10 md:col-span-14 md:mt-20">
        <p className="t-h2 tight">
          <span>Let&rsquo;s build</span>
          <span>something together</span>
        </p>
      </div>

      <div className="col-span-6 mt-12 flex flex-col gap-8 md:col-span-5 md:col-start-1 md:mt-20">
        <div className="flex flex-col items-start gap-4">
          <a
            href={`mailto:${site.email}`}
            className="t-lead border-b border-fg/25 pb-1 transition-colors hover:border-fg"
          >
            {site.email}
          </a>
          <CopyEmail />
        </div>
      </div>

      <div className="col-span-6 md:col-span-4 md:col-start-10">
        <h3 className="t-label mb-4 text-fg/50">Elsewhere</h3>
        <ul className="flex flex-col">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="t-label flex items-baseline justify-between gap-4 border-t border-fg/15 py-3 text-fg/70 transition-colors hover:text-fg"
              >
                {social.label}
                <span className="text-fg/40">{social.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
