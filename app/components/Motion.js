"use client";

import { useEffect } from "react";
import { useRouteKey } from "../lib/routeKey";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, whenCurtainDone } from "../lib/motion";

/*
 * Animations de page, déclarées dans le HTML :
 *   data-reveal="lines"   texte qui apparaît ligne par ligne (montée légère + fondu)
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
  const routeKey = useRouteKey();

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
  // Le découpage reste en place après l'animation (le défaire refaisait la mise en page
  // du texte : saut visible). autoSplit redécoupe si la largeur ou les polices changent.
  gsap.utils.toArray('[data-reveal="lines"]').forEach((el) => {
    const entry = { el, tl: null, delay: delayOf(el), start: "top 90%" };
    // Pas de masque : une ligne masquée est forcément coupée net pendant sa montée.
    // Chaque ligne monte légèrement en apparaissant en fondu.
    SplitText.create(el, {
      type: "lines",
      autoSplit: true,
      // le texte reste lu normalement (les lignes ne coupent pas les mots) ;
      // pas d'aria-label ajouté, interdit sur <p> et redondant
      aria: "none",
      // éléments à garder d'un seul tenant (ex. « nᵒ 345 »)
      ignore: "[data-keep]",
      onSplit(self) {
        const tl = gsap
          .timeline({ paused: true })
          .fromTo(
            self.lines,
            { yPercent: 45, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.4, ease: "silk", stagger: 0.1 },
          );
        if (entry.played) tl.progress(1); // redécoupé après coup : on ne rejoue pas
        entry.tl?.kill();
        entry.tl = tl;
      },
    });
    gsap.set(el, { autoAlpha: 1 });
    entries.push(entry);
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
  // Les positions sont calculées depuis la liste (non collante) et la hauteur des cartes :
  // mesurer une carte collante donne un résultat qui dépend du défilement au moment
  // du calcul (cartes déjà estompées, effet trop rapide).
  gsap.utils.toArray("[data-stack]").forEach((list) => {
    const cards = gsap.utils.toArray(":scope > li", list);
    const listTop = () => list.getBoundingClientRect().top + window.scrollY;
    // haut « naturel » de la carte k dans la liste (k = cards.length : fin de la liste)
    const naturalTop = (k) => cards.slice(0, k).reduce((sum, c) => sum + c.offsetHeight, 0);
    const stickyTop = (el) => parseFloat(getComputedStyle(el).top) || 0;

    cards.forEach((card, i) => {
      const inner = card.firstElementChild;
      const img = card.querySelector("img");
      // Recouverte par la carte suivante (la dernière : par le contenu qui suit la pile),
      // de son entrée en bas de l'écran jusqu'à ce qu'elle soit posée sur la pile.
      const next = cards[i + 1];
      const arrival = () => listTop() + naturalTop(i + 1);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: () => arrival() - window.innerHeight,
          end: () => arrival() - (next ? stickyTop(next) : stickyTop(card)),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(inner, { scale: 0.9, ease: "none" }, 0);
      if (img) tl.to(img, { opacity: 0.25, ease: "none" }, 0);
    });
  });
}
