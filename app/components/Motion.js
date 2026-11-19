"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, whenCurtainDone } from "../lib/motion";

/*
 * Animations de page, déclarées dans le HTML :
 *   data-reveal="lines"   texte dévoilé ligne par ligne derrière un masque
 *   data-reveal="fade"    fondu + légère montée
 *   data-reveal="image"   cadre qui s'ouvre de bas en haut, image qui se pose (dézoom)
 *   data-parallax         image qui glisse doucement dans son cadre
 *   data-stack            pile de cartes sticky : la carte recouverte recule
 *   data-delay="0.2"      délai supplémentaire (secondes)
 *
 * Cycle : états de départ posés sous le rideau → déclencheurs créés à la levée du rideau
 * → recalés quand la page est immobile (« curtain:settled ») → rattrapage : tout ce qui est
 * déjà visible, ou impossible à atteindre en défilant, est joué.
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
    let reveals = null;

    const settle = () => {
      if (!reveals) return;
      ScrollTrigger.refresh();
      reveals.catchUp();
    };
    window.addEventListener("curtain:settled", settle);

    fontsReady().then(() => {
      if (cancelled) return;
      ctx.add(() => {
        reveals = setup();
        root.dataset.motion = "ready";
      });
      stopWaiting = whenCurtainDone(() => {
        if (cancelled) return;
        // créés dans le même contexte : tout est nettoyé au changement de page
        ctx.add(() => {
          reveals.arm();
          ScrollTrigger.refresh();
          reveals.catchUp();
        });
      });
    });

    return () => {
      cancelled = true;
      stopWaiting();
      window.removeEventListener("curtain:settled", settle);
      ctx.revert();
    };
  }, [routeKey]);

  return null;
}

/** Attend les polices réellement utilisées (le découpage en lignes en dépend). */
function fontsReady() {
  const css = getComputedStyle(document.documentElement);
  const families = ["--font-display", "--font-body"].map((v) => css.getPropertyValue(v).trim()).filter(Boolean);
  const loads = families.map((f) => document.fonts.load(`1em ${f}`).catch(() => {}));
  const timeout = new Promise((r) => setTimeout(r, 2500));
  return Promise.race([Promise.all(loads).then(() => document.fonts.ready), timeout]);
}

function setup() {
  const entries = []; // { el, tl, delay, start, wave, played, st }
  const delayOf = (el) => Number(el.dataset.delay ?? 0);

  const play = (entry, stagger = 0) => {
    if (entry.played) return;
    entry.played = true;
    entry.tl.delay(entry.delay + stagger).play();
  };

  // Lignes masquées
  gsap.utils.toArray('[data-reveal="lines"]').forEach((el) => {
    const split = SplitText.create(el, { type: "lines", mask: "lines" });
    gsap.set(split.lines, { yPercent: 105 });
    gsap.set(el, { autoAlpha: 1 });
    const tl = gsap.timeline({ paused: true, onComplete: () => split.revert() });
    tl.to(split.lines, { yPercent: 0, duration: 1.3, ease: "silk", stagger: 0.09 });
    entries.push({ el, tl, delay: delayOf(el), start: "top 90%" });
  });

  // Fondus (opacité seulement : l'élément reste accessible au clavier et aux lecteurs d'écran)
  gsap.utils.toArray('[data-reveal="fade"]').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 28, visibility: "visible" });
    const tl = gsap.timeline({ paused: true });
    tl.to(el, { opacity: 1, y: 0, duration: 1.2, ease: "silk", clearProps: "transform,opacity" });
    entries.push({ el, tl, delay: delayOf(el), start: "top 94%" });
  });

  // Images
  gsap.utils.toArray('[data-reveal="image"]').forEach((el) => {
    const img = el.querySelector("img");
    gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)", visibility: "visible" });
    if (img) gsap.set(img, { scale: 1.25 });
    const tl = gsap.timeline({ paused: true });
    tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "curtain", clearProps: "clipPath" });
    if (img) tl.to(img, { scale: 1, duration: 1.9, ease: "silk", clearProps: "transform" }, 0);
    entries.push({ el, tl, delay: delayOf(el), start: "top 94%", wave: true });
  });

  // Coups de pinceau : chaque passage se peint d'un geste, légèrement décalés
  gsap.utils.toArray("[data-brush]").forEach((el) => {
    const paths = el.querySelectorAll("path");
    gsap.set(paths, { strokeDashoffset: 1 });
    const tl = gsap.timeline({ paused: true });
    tl.to(paths, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut", stagger: 0.12 });
    entries.push({ el, tl, delay: 0.2, start: "top 85%" });
  });

  return {
    /** Crée les déclencheurs (à la levée du rideau). */
    arm() {
      entries
        .filter((e) => !e.wave)
        .forEach((entry) => {
          entry.st = ScrollTrigger.create({
            trigger: entry.el,
            start: entry.start,
            once: true,
            onEnter: () => play(entry),
          });
        });
      // les images qui entrent ensemble se dévoilent en vague
      const waves = entries.filter((e) => e.wave);
      if (waves.length) {
        const byEl = new Map(waves.map((e) => [e.el, e]));
        const triggers = ScrollTrigger.batch(
          waves.map((e) => e.el),
          {
            start: "top 94%",
            once: true,
            onEnter: (batch) => batch.forEach((el, i) => play(byEl.get(el), i * 0.11)),
          }
        );
        triggers.forEach((st, i) => (waves[i].st = st));
      }
      armScrollEffects();
    },

    /** Joue ce qui est déjà visible ou qu'on ne pourra jamais atteindre en défilant. */
    catchUp() {
      const max = ScrollTrigger.maxScroll(window);
      const vh = window.innerHeight;
      let i = 0;
      entries.forEach((entry) => {
        if (entry.played) return;
        const top = entry.el.getBoundingClientRect().top;
        const unreachable = entry.st && entry.st.start > max;
        if (top < vh || unreachable) play(entry, entry.wave ? i++ * 0.11 : 0);
      });
    },
  };
}

function armScrollEffects() {
  // Les coups de pinceau dérivent doucement, à un rythme différent du texte
  gsap.utils.toArray("[data-brush]").forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 12 },
      {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  // Parallaxe douce dans le cadre (image légèrement agrandie pour ne jamais montrer de bord)
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const target = el.firstElementChild;
    if (!target) return;
    gsap.fromTo(
      target,
      { yPercent: -5, scale: 1.12 },
      {
        yPercent: 5,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  // Pile de cartes : la carte recouverte recule et s'estompe, au rythme du défilement
  gsap.utils.toArray("[data-stack]").forEach((list) => {
    const cards = gsap.utils.toArray(":scope > li", list);
    cards.slice(0, -1).forEach((card, i) => {
      const inner = card.firstElementChild;
      const img = card.querySelector("img");
      const st = () => ({
        trigger: cards[i + 1],
        start: "top bottom",
        end: () => `top ${card.getBoundingClientRect().height * 0.15 + 96}px`,
        scrub: true,
      });
      gsap.to(inner, { scale: 0.9, ease: "none", scrollTrigger: st() });
      if (img) gsap.to(img, { opacity: 0.25, ease: "none", scrollTrigger: st() });
    });
  });
}
