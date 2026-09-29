"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Rollover } from "@/components/rollover";
import { lockScroll } from "@/lib/lenis-registry";
import { site } from "@/lib/site";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "sending" | "done";

export function ContactModal({ open, onClose }: ContactModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      const items = root.querySelectorAll<HTMLElement>("[data-modal-item]");
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.set(root, { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(
          items,
          { yPercent: 115 },
          { yPercent: 0, duration: 0.65, stagger: 0.05 }
        )
        .fromTo(root, { "--cut": "0%" }, { "--cut": "100%", duration: 0.7 }, 0);
      const t = window.setTimeout(() => firstFieldRef.current?.focus(), 380);
      return () => {
        window.clearTimeout(t);
        tl.kill();
      };
    }

    const tl = gsap.timeline();
    tl.to(root.querySelectorAll<HTMLElement>("[data-modal-item]"), {
      yPercent: 115,
      duration: 0.35,
      stagger: 0.03,
    }).to(root, { autoAlpha: 0, pointerEvents: "none", duration: 0.3 });
    return () => {
      tl.kill();
      restoreRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Give the exit animation a moment before clearing the success state.
      const t = window.setTimeout(() => setStatus("idle"), 400);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", open);
    lockScroll(open);
    return () => {
      document.documentElement.classList.remove("is-locked");
      lockScroll(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    // No backend in this build — the success state stands in for a real send.
    window.setTimeout(() => setStatus("done"), 650);
  };

  if (status === "done") {
    return (
      <div ref={rootRef} className="overlay success-overlay" role="status" aria-live="polite">
        <div className="inner">
          <p className="success-title font-headline-1" data-modal-item>
            Thank you
          </p>
          <p className="success-body font-body-12" data-modal-item>
            Your message is on its way. I usually reply within two working days.
          </p>
          <div data-modal-item>
            <button type="button" className="link font-body-12 uppercase" onClick={onClose}>
              <Rollover label="Close" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="overlay modal-overlay"
      role="dialog"
      aria-modal={open ? "true" : undefined}
      aria-hidden={!open}
      aria-label="Contact"
      inert={!open ? true : undefined}
    >
      <div className="inner">
        <div className="modal-head">
          <h2 className="font-headline-2" data-modal-item>
            <span className="modal-head__mask">
              <Rollover label="Say hello" />
            </span>
          </h2>
          <p className="modal-body font-body-12" data-modal-item>
            Tell me about the project, the timeline and the budget. Or email me directly at{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        </div>

        <form className="modal-form" onSubmit={onSubmit} noValidate={false}>
          <label className="field font-body-12" data-modal-item>
            <span className="field-label uppercase">Name</span>
            <input
              ref={firstFieldRef}
              required
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
          </label>
          <label className="field font-body-12" data-modal-item>
            <span className="field-label uppercase">Email</span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            />
          </label>
          <label className="field font-body-12" data-modal-item>
            <span className="field-label uppercase">Message</span>
            <textarea
              required
              name="message"
              rows={4}
              value={values.message}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            />
          </label>

          <div className="modal-actions" data-modal-item>
            <button type="submit" className="link font-body-12 uppercase" disabled={status === "sending"}>
              <Rollover label={status === "sending" ? "Sending" : "Send"} />
            </button>
            <button type="button" className="link font-body-12 uppercase" onClick={onClose}>
              <Rollover label="Close" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
