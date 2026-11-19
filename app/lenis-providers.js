"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname, useSearchParams } from "next/navigation";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./lib/motion";

/**
 * Défilement doux (Lenis) piloté par l'horloge de GSAP, pour que ScrollTrigger
 * et le défilement restent parfaitement synchronisés. Désactivé si l'utilisateur
 * demande moins d'animations.
 */
export default function SmoothScrollProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: { offset: -130 } });
    globalThis.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (globalThis.__lenis === lenis) globalThis.__lenis = null;
    };
  }, []);

  // Nouvelle page : retour en haut (le rideau couvre l'écran à ce moment-là)
  useEffect(() => {
    const lenis = globalThis.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [routeKey]);

  return children;
}
