"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Viewer from "@/app/components/Viewer";
import { prefersReducedMotion } from "@/app/lib/motion";
import { lockScroll, unlockScroll } from "@/app/lib/scrollLock";
import { viewerSrc } from "@/app/lib/images";
import { useRouteKey } from "@/app/lib/routeKey";

const ModalContext = createContext(null);
export function useModal() {
  return useContext(ModalContext);
}

const NAME = "artwork";

/*
 * Préchargement des grandes images. Une promesse par image, mémorisée :
 * le survol (ou le toucher) d'une vignette lance le téléchargement, le clic n'a
 * souvent plus rien à attendre. La transition ne part que sur une image décodée,
 * sinon elle morpherait vers un cadre vide.
 */
const loads = new Map();
function preload(src) {
  if (!src) return Promise.resolve();
  if (!loads.has(src)) {
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
    const p = img.decode().catch(() => {
      loads.delete(src); // échec réseau : on pourra réessayer
    });
    loads.set(src, p);
  }
  return loads.get(src);
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const MAX_WAIT = 5000; // au-delà, on ouvre quand même (la vignette sert de remplaçant)

export function prefetchOeuvre(oeuvre) {
  preload(viewerSrc(oeuvre?.image));
}

/**
 * Transition d'élément partagé (View Transitions API) : l'image `from` se transforme
 * en l'image `to` révélée par `update`. Sans prise en charge, mise à jour directe.
 */
function morph(update, getFrom, getTo, kind) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return Promise.resolve();
  }
  const from = getFrom();
  if (from) from.style.viewTransitionName = NAME;
  // type de transition lu par le CSS (globals.css) : la fermeture a sa propre chorégraphie
  const root = document.documentElement;
  if (kind) root.dataset.vt = kind;
  const transition = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = "";
    flushSync(update);
    const to = getTo();
    if (to) to.style.viewTransitionName = NAME;
  });
  return transition.finished.catch(() => {}).finally(() => {
    delete root.dataset.vt;
    const to = getTo();
    if (to) to.style.viewTransitionName = "";
  });
}

const viewerImg = () => document.querySelector("dialog[open] [data-viewer-img]");
const findThumb = (id) => document.querySelector(`[data-oeuvre="${CSS.escape(String(id))}"] img`);
const thumbOf = (id) => {
  const el = findThumb(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight ? el : null; // seulement si visible
};

/*
 * Zone sûre : sous la barre de navigation, avec une marge. Une vignette à moitié cachée
 * (sous la barre ou en bas de l'écran) ferait passer l'image animée par-dessus la barre :
 * on ramène la page juste assez pour qu'elle soit entièrement visible.
 */
const MARGIN = 24;
function scrollDelta(el) {
  const header = document.querySelector(".site-header")?.offsetHeight ?? 0;
  const top = header + MARGIN;
  const bottom = window.innerHeight - MARGIN;
  const r = el.getBoundingClientRect();
  if (r.top >= top && r.bottom <= bottom) return 0;
  // trop haute pour la zone, ou cachée sous la barre : on aligne le haut ; sinon le bas
  if (r.height > bottom - top || r.top < top) return r.top - top;
  return r.bottom - bottom;
}
function bringIntoView(el, immediate) {
  const delta = el ? scrollDelta(el) : 0;
  if (!delta) return Promise.resolve();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.min(max, Math.max(0, window.scrollY + delta));
  const lenis = globalThis.__lenis;
  if (!lenis || immediate || prefersReducedMotion()) {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: "instant" });
    return nextFrames(2); // laisser ScrollTrigger et le rendu suivre
  }
  return new Promise((resolve) => {
    lenis.scrollTo(y, { duration: 0.6, force: true, easing: (t) => 1 - (1 - t) ** 4, onComplete: resolve });
    setTimeout(resolve, 900); // filet de sécurité
  }).then(() => nextFrames(1));
}
const nextFrames = (n) =>
  new Promise((r) => {
    const tick = (k) => (k ? requestAnimationFrame(() => tick(k - 1)) : r());
    tick(n);
  });

export function ModalProvider({ children, vente = null }) {
  const routeKey = useRouteKey();

  // { list, index } : on peut passer d'une œuvre à l'autre dans la même liste
  const [state, setState] = useState(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Une seule transition à la fois (double clic, défilement + clic, Échap pendant l'ouverture…)
  const busy = useRef(false);

  const openModal = useCallback(async (oeuvre, list, fromImg) => {
    if (busy.current || stateRef.current) return;
    busy.current = true;
    // Verrou immédiat : la page ne glisse plus (inertie comprise) pendant le préchargement
    // et la transition, donc la vignette reste exactement là où elle a été cliquée.
    lockScroll();
    try {
      const items = Array.isArray(list) && list.length ? list : [oeuvre];
      const index = Math.max(0, items.findIndex((o) => o.id === oeuvre.id));
      // La vignette affichée sert de remplaçant tant que la grande image n'est pas là
      const placeholder = fromImg?.currentSrc || null;

      // Image pas encore prête : indicateur discret sur la vignette (après un court délai,
      // pour ne pas clignoter quand elle est en cache)
      const button = fromImg?.closest("[data-oeuvre]");
      const ready = preload(viewerSrc(oeuvre?.image));
      const flag = setTimeout(() => button?.setAttribute("data-loading", ""), 120);
      // vignette à moitié cachée : on la ramène pendant le chargement (pas d'attente en plus)
      await Promise.all([Promise.race([ready, wait(MAX_WAIT)]), bringIntoView(fromImg, false)]);
      clearTimeout(flag);
      button?.removeAttribute("data-loading");

      await morph(() => setState({ list: items, index, placeholder }), () => fromImg, viewerImg);
      // Les voisines se chargent pendant qu'on regarde
      if (items.length > 1) {
        preload(viewerSrc(items[(index + 1) % items.length]?.image));
        preload(viewerSrc(items[(index - 1 + items.length) % items.length]?.image));
      }
    } finally {
      busy.current = false;
    }
  }, []);

  const closeModal = useCallback(async () => {
    const s = stateRef.current;
    if (!s || busy.current) return;
    busy.current = true;
    try {
      const id = s.list[s.index]?.id;
      // La page est cachée par la visionneuse : on la replace instantanément pour que
      // l'image retombe sur une vignette entièrement visible (après « Suivante » aussi).
      const thumb = findThumb(id);
      if (thumb) {
        await bringIntoView(thumb, true);
        // vignette paresseuse qui vient d'entrer dans l'écran : attendre qu'elle soit prête
        await Promise.race([thumb.decode?.().catch(() => {}), wait(500)]);
      }
      await morph(() => setState(null), viewerImg, () => thumbOf(id), "fermeture");
    } finally {
      busy.current = false;
      unlockScroll(); // libéré seulement une fois l'image revenue à sa place
    }
  }, []);

  const step = useCallback(async (delta) => {
    const s = stateRef.current;
    if (!s || busy.current) return;
    busy.current = true;
    try {
      const index = (s.index + delta + s.list.length) % s.list.length;
      await Promise.race([preload(viewerSrc(s.list[index]?.image)), wait(MAX_WAIT)]);
      await morph(() => setState({ ...s, index, placeholder: null }), viewerImg, viewerImg);
      preload(viewerSrc(s.list[(index + delta + s.list.length) % s.list.length]?.image));
    } finally {
      busy.current = false;
    }
  }, []);

  // Fermeture immédiate lors d'un changement de page
  const [openedOn, setOpenedOn] = useState(routeKey);
  if (openedOn !== routeKey) {
    setOpenedOn(routeKey);
    if (state) setState(null);
  }
  // …et libération du verrou correspondant
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !state && !busy.current) unlockScroll();
    wasOpen.current = Boolean(state);
  }, [state, routeKey]);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);
  const many = (state?.list.length ?? 0) > 1;

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Viewer
        oeuvre={state ? state.list[state.index] : null}
        placeholder={state?.placeholder}
        vente={vente}
        position={many ? `${state.index + 1} / ${state.list.length}` : null}
        onClose={closeModal}
        onPrev={many ? () => step(-1) : null}
        onNext={many ? () => step(1) : null}
      />
    </ModalContext.Provider>
  );
}
