"use client";

import { useCallback, useState } from "react";
import { Backdrop } from "@/components/backdrop";
import { ContactModal } from "@/components/contact-modal";
import { Intro } from "@/components/intro";
import { MenuOverlay } from "@/components/menu-overlay";
import { PageTransition } from "@/components/page-transition";
import { SiteHeader } from "@/components/site-header";
import { TimeProvider } from "@/components/time-provider";
import { site } from "@/lib/site";

/**
 * Persistent chrome: the header, the shared backdrop, both overlays, the route
 * transition and the clock that drives the palette. The routes render inside the
 * transition so a navigation wipes instead of swapping.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  // The menu and the contact modal are mutually exclusive: one shared backdrop
  // serves both, and only one overlay is ever on screen.
  const openMenu = useCallback(() => {
    setContactOpen(false);
    setMenuOpen(true);
  }, []);

  const openContact = useCallback(() => {
    setMenuOpen(false);
    setContactOpen(true);
  }, []);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setContactOpen(false);
  }, []);

  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <TimeProvider timezone={site.timezone}>
      <Intro onDone={onIntroDone} />

      <a className="skip-link font-body-12 uppercase" href="#main">
        Skip to content
      </a>

      <Backdrop visible={menuOpen || contactOpen} onClick={closeAll} />

      <SiteHeader
        intro={!introDone}
        onMenu={menuOpen ? closeAll : openMenu}
        onContact={openContact}
        menuOpen={menuOpen}
      />

      <PageTransition>{children}</PageTransition>

      <MenuOverlay open={menuOpen} onClose={closeAll} />
      <ContactModal open={contactOpen} onClose={closeAll} />
    </TimeProvider>
  );
}
