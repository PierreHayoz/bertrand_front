"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import Viewer from "@/app/components/Viewer";
import { prefersReducedMotion } from "@/app/lib/motion";
import { lockScroll, unlockScroll } from "@/app/lib/scrollLock";

const ModalContext = createContext(null);
export function useModal() {
  return useContext(ModalContext);
}

const NAME = "artwork";

/** Précharge la grande image pour que la transition morphe vers une image déjà prête. */
function preload(src, timeout = 450) {
  if (!src) return Promise.resolve();
  const img = new window.Image();
  img.src = src;
  return Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, timeout))]);
}

/**
 * Transition d'élément partagé (View Transitions API) : l'image `from` se transforme
 * en l'image `to` révélée par `update`. Sans prise en charge, mise à jour directe.
 */
function morph(update, getFrom, getTo) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return Promise.resolve();
  }
  const from = getFrom();
  if (from) from.style.viewTransitionName = NAME;
  const transition = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = "";
    flushSync(update);
    const to = getTo();
    if (to) to.style.viewTransitionName = NAME;
  });
  return transition.finished.catch(() => {}).finally(() => {
    const to = getTo();
    if (to) to.style.viewTransitionName = "";
  });
}

const viewerImg = () => document.querySelector("dialog[open] [data-viewer-img]");
const thumbOf = (id) => {
  const el = document.querySelector(`[data-oeuvre="${CSS.escape(String(id))}"] img`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight ? el : null; // seulement si visible
};

export function ModalProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

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
      await preload(oeuvre.image?.srcLarge);
      await morph(() => setState({ list: items, index }), () => fromImg, viewerImg);
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
      await morph(() => setState(null), viewerImg, () => thumbOf(id));
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
      await preload(s.list[index]?.image?.srcLarge);
      await morph(() => setState({ ...s, index }), viewerImg, viewerImg);
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
        position={many ? `${state.index + 1} / ${state.list.length}` : null}
        onClose={closeModal}
        onPrev={many ? () => step(-1) : null}
        onNext={many ? () => step(1) : null}
      />
    </ModalContext.Provider>
  );
}
