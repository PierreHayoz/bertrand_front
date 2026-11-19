"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, whenCurtainDone } from "../lib/motion";

/*
 * Animations de page, déclarées dans le HTML :
 *   data-reveal="lines"   titre/texte dévoilé ligne par ligne derrière un masque
 *   data-reveal="fade"    fondu + légère montée
 *   data-reveal="image"   cadre qui s'ouvre de bas en haut, image qui se pose (dézoom)
 *   data-parallax         image qui glisse doucement dans son cadre
 *   data-stack            pile de cartes sticky : la carte recouverte recule
 *   data-delay="0.2"      délai supplémentaire (secondes)
 *
 * Les états de départ sont posés dès que la page est montée (sous le rideau),
 * les apparitions se déclenchent une fois le rideau levé, à l'entrée dans l'écran.
 */
export default function Motion() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.dataset.motion = "off";
      return;
    }

    let cancelled = false;
    let stopWaiting = () => {};
    const ctx = gsap.context(() => {});

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const plays = setup();
        root.dataset.motion = "ready";
        stopWaiting = whenCurtainDone(() => {
          if (cancelled) return;
          // créés dans le même contexte : tout est nettoyé au changement de page
          ctx.add(() => {
            plays.forEach((p) => p());
            ScrollTrigger.refresh();
          });
        });
      });
    });

    return () => {
      cancelled = true;
      stopWaiting();
      ctx.revert();
    };
  }, [routeKey]);

  return null;
}

/** Pose les états initiaux ; renvoie les fonctions qui créent les déclencheurs. */
function setup() {
  const plays = [];
  const delayOf = (el) => Number(el.dataset.delay ?? 0);
  const onEnter = (el, tl, start = "top 88%") =>
    plays.push(() => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tl.play() }));

  // Lignes masquées
  gsap.utils.toArray('[data-reveal="lines"]').forEach((el) => {
    const split = SplitText.create(el, { type: "lines", mask: "lines" });
    const tl = gsap.timeline({ paused: true, delay: delayOf(el), onComplete: () => split.revert() });
    tl.fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 1.3, ease: "silk", stagger: 0.09 });
    gsap.set(el, { autoAlpha: 1 });
    onEnter(el, tl);
  });

  // Fondus
  gsap.utils.toArray('[data-reveal="fade"]').forEach((el) => {
    const tl = gsap.timeline({ paused: true, delay: delayOf(el) });
    tl.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "silk", clearProps: "transform" });
    onEnter(el, tl, "top 92%");
  });

  // Images : regroupées par vagues pour un décalage naturel ligne par ligne
  const images = gsap.utils.toArray('[data-reveal="image"]');
  const timelines = new Map();
  images.forEach((el) => {
    const img = el.querySelector("img");
    gsap.set(el, { autoAlpha: 1 });
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "curtain", clearProps: "clipPath" }
    );
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.9, ease: "silk", clearProps: "transform" }, 0);
    timelines.set(el, tl);
  });
  if (images.length) {
    plays.push(() =>
      ScrollTrigger.batch(images, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          batch.forEach((el, i) => timelines.get(el).delay(i * 0.11 + delayOf(el)).play()),
      })
    );
  }

  // Parallaxe douce dans le cadre (l'image est légèrement agrandie pour ne jamais montrer de bord)
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const target = el.firstElementChild;
    if (!target) return;
    gsap.set(target, { scale: 1.12 });
    plays.push(() =>
      gsap.fromTo(
        target,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      )
    );
  });

  // Pile de cartes : la carte recouverte recule et s'estompe, au rythme du défilement
  gsap.utils.toArray("[data-stack]").forEach((list) => {
    const cards = gsap.utils.toArray(":scope > li", list);
    cards.slice(0, -1).forEach((card, i) => {
      const inner = card.firstElementChild;
      const img = card.querySelector("img");
      plays.push(() => {
        const st = {
          trigger: cards[i + 1],
          start: "top bottom",
          end: () => `top ${card.getBoundingClientRect().height * 0.15 + 96}px`,
          scrub: true,
        };
        gsap.to(inner, { scale: 0.9, ease: "none", scrollTrigger: st });
        if (img) gsap.to(img, { autoAlpha: 0.25, ease: "none", scrollTrigger: { ...st } });
      });
    });
  });

  return plays;
}
