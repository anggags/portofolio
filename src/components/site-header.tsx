"use client";

import Link from "next/link";
import { Rollover } from "@/components/rollover";
import { TimeWidget } from "@/components/time-widget";
import { site } from "@/lib/site";

type SiteHeaderProps = {
  intro: boolean;
  onMenu: () => void;
  onContact: () => void;
  menuOpen: boolean;
};

export function SiteHeader({ intro, onMenu, onContact, menuOpen }: SiteHeaderProps) {
  return (
    <header
      className={`header font-body-12 uppercase${intro ? " header--intro" : ""}`}
      data-site-header
    >
      <div className="cont">
        <div className="logo-wrapper">
          <Link href="/" className="logo" aria-label={`${site.firstName} ${site.lastName} — home`}>
            <Rollover label={site.firstName} />
            <Rollover label={site.lastName} />
          </Link>
        </div>

        {/* Three strokes so the intro timeline can draw them in sequence. */}
        <Link href="/" className="svg" aria-label="Home" data-mark>
          <svg viewBox="0 0 101 51" fill="none" aria-hidden focusable="false">
            <path d="M4 25.5H97" stroke="currentColor" strokeWidth="1" />
            <path
              d="M50.5 4.5A21 21 0 1 1 50.49 4.5"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M50.5 25.5V46.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>

        <nav className="nav" aria-label="Primary">
          <ul className="links">
            <li>
              <button
                type="button"
                className="link font-body-12 uppercase"
                onClick={onMenu}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
              >
                <Rollover label={menuOpen ? "Close" : "Menu"} />
              </button>
            </li>
            <li className="contact-item">
              <button type="button" className="link font-body-12 uppercase" onClick={onContact}>
                <Rollover label="Contact" />
              </button>
            </li>
          </ul>
        </nav>

        <div className="easter">
          <TimeWidget timezone={site.timezone} />
        </div>
      </div>
    </header>
  );
}
