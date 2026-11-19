"use client";

import { useEffect, useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { gsap, markCurtain, prefersReducedMotion, takeNextLabel } from "./lib/motion";

export const LABELS = {
  "/": { label: "Bertrand Kolly", subtitle: "Artiste peintre" },
  "/oeuvres": { label: "Œuvres" },
  "/about": { label: "À propos" },
  "/expositions": { label: "Expositions" },
};

/** La page est immobile (plus de décalage lié au rideau) : les déclencheurs peuvent être recalés. */
const settled = () => window.dispatchEvent(new Event("curtain:settled"));

const labelFor = (href) => {
  const path = new URL(href, window.location.href).pathname;
  return LABELS[path] ?? { label: document.title.split("|")[0].trim() };
};

/**
 * Rideau de transition entre les pages.
 * Sortie : le rideau monte depuis le bas pendant que la page s'éloigne vers le haut,
 * puis le titre de la page suivante se dévoile ligne masquée.
 * Entrée : le titre s'efface, le rideau se lève et la nouvelle page remonte avec lui.
 */
export function Providers({ children }) {
  const curtain = useRef(null);
  const label = useRef(null);
  const subtitle = useRef(null);

  const setText = ({ label: l, subtitle: s }) => {
    label.current.textContent = l ?? "";
    subtitle.current.textContent = s ?? "";
  };

  // Premier chargement
  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(curtain.current, { yPercent: 100 });
      markCurtain(true);
      return;
    }
    setText(labelFor(window.location.href));
    const tl = gsap
      .timeline({ defaults: { ease: "silk" } })
      .fromTo([label.current, subtitle.current], { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07 }, 0.1)
      .to([label.current, subtitle.current], { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.04 }, "+=0.05")
      .to(curtain.current, { yPercent: -100, duration: 1.15, ease: "curtain" }, "-=0.2")
      .fromTo("#contenu", { y: "18vh" }, { y: 0, duration: 1.15, ease: "curtain", clearProps: "transform" }, "<")
      .add(() => markCurtain(true), "<0.55")
      .set(curtain.current, { yPercent: 100 })
      .add(settled);
    return () => tl.kill();
  }, []);

  return (
    <TransitionRouter
      auto
      leave={(next, _from, to) => {
        markCurtain(false);
        if (prefersReducedMotion()) {
          next();
          return;
        }
        const tl = gsap
          .timeline({ defaults: { ease: "curtain" }, onComplete: next })
          .fromTo(curtain.current, { yPercent: 100 }, { yPercent: 0, duration: 0.95 })
          .to("#contenu", { y: "-12vh", duration: 0.95 }, 0)
          .add(() => setText(takeNextLabel(labelFor(to))), 0.3)
          .fromTo(
            [label.current, subtitle.current],
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8, ease: "silk", stagger: 0.06 },
            0.55
          );
        return () => tl.kill();
      }}
      enter={(next) => {
        if (prefersReducedMotion()) {
          gsap.set("#contenu", { clearProps: "transform" });
          markCurtain(true);
          next();
          return;
        }
        const tl = gsap
          .timeline({ defaults: { ease: "curtain" }, onComplete: next })
          .to([label.current, subtitle.current], { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.04 })
          .to(curtain.current, { yPercent: -100, duration: 1.05 }, "-=0.1")
          .fromTo("#contenu", { y: "18vh" }, { y: 0, duration: 1.05, clearProps: "transform" }, "<")
          .add(() => markCurtain(true), "<0.5")
          .set(curtain.current, { yPercent: 100 })
          .add(settled);
        return () => tl.kill();
      }}
    >
      <div
        ref={curtain}
        aria-hidden="true"
        className="curtain fixed inset-0 z-9000 pointer-events-none bg-inverse text-inverse-ink flex flex-col items-center justify-center gap-3 px-8 text-center"
      >
        <span className="block overflow-hidden pb-[0.12em]">
          <span ref={label} className="block t-h1" />
        </span>
        <span className="block overflow-hidden">
          <span ref={subtitle} className="block t-label text-inverse-muted" />
        </span>
      </div>
      {children}
    </TransitionRouter>
  );
}
