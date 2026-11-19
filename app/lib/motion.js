"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/*
 * Courbes maison : une sortie très douce (« silk ») pour les apparitions,
 * et un in-out appuyé (« curtain ») pour les grands mouvements.
 */
CustomEase.create("silk", "0.16, 1, 0.3, 1");
CustomEase.create("curtain", "0.76, 0, 0.24, 1");

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Rideau de transition : état partagé ---------------- */

let curtainDone = false;
let nextLabel = null;

/** Libellé affiché sur le rideau pour la page suivante (posé au clic). */
export function setNextLabel(label, subtitle = null) {
  nextLabel = { label, subtitle };
}
export function takeNextLabel(fallback) {
  const l = nextLabel ?? fallback;
  nextLabel = null;
  return l;
}

export function markCurtain(done) {
  curtainDone = done;
  if (done) window.dispatchEvent(new Event("curtain:done"));
}

/** Exécute `cb` quand le rideau est levé (immédiatement s'il l'est déjà). */
export function whenCurtainDone(cb) {
  if (curtainDone) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("curtain:done", handler, { once: true });
  return () => window.removeEventListener("curtain:done", handler);
}
