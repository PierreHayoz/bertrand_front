"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";

/**
 * Pastille qui suit la souris et apparaît sur les éléments `data-cursor="Libellé"`.
 * Uniquement avec une souris (pas au toucher) et sans « réduire les animations ».
 */
export default function Cursor() {
  const dot = useRef(null);
  const text = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return;

    const el = dot.current;
    const root = document.documentElement;
    root.dataset.cursor = "on";

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 1 });
    const moveX = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });

    let target = null;
    let placed = false;

    const show = (label) => {
      text.current.textContent = label;
      gsap.to(el, { scale: 1, duration: 0.6, ease: "silk", overwrite: "auto" });
    };
    const hide = () => gsap.to(el, { scale: 0, duration: 0.45, ease: "silk", overwrite: "auto" });

    const onMove = (e) => {
      if (!placed) {
        // première position : pas de glissement depuis le coin de l'écran
        gsap.set(el, { x: e.clientX, y: e.clientY });
        placed = true;
      }
      moveX(e.clientX);
      moveY(e.clientY);
      const next = e.target.closest?.("[data-cursor]") ?? null;
      if (next !== target) {
        target = next;
        if (target) show(target.dataset.cursor);
        else hide();
      }
    };
    const onDown = () => target && gsap.to(el, { scale: 0.82, duration: 0.25, ease: "power2.out" });
    const onUp = () => target && gsap.to(el, { scale: 1, duration: 0.5, ease: "silk" });
    const onLeave = () => {
      target = null;
      hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="invisible fixed left-0 top-0 z-8000 pointer-events-none grid h-22 w-22 place-items-center rounded-full bg-accent text-accent-ink"
    >
      <span ref={text} className="t-label" />
    </div>
  );
}
