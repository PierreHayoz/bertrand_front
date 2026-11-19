"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import Viewer from "@/app/components/Viewer";
import { prefersReducedMotion } from "@/app/lib/motion";

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
    return;
  }
  const from = getFrom();
  if (from) from.style.viewTransitionName = NAME;
  const transition = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = "";
    flushSync(update);
    const to = getTo();
    if (to) to.style.viewTransitionName = NAME;
  });
  transition.finished.finally(() => {
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

  const openModal = useCallback(async (oeuvre, list, fromImg) => {
    const items = Array.isArray(list) && list.length ? list : [oeuvre];
    const index = Math.max(0, items.findIndex((o) => o.id === oeuvre.id));
    await preload(oeuvre.image?.srcLarge);
    morph(() => setState({ list: items, index }), () => fromImg, viewerImg);
  }, []);

  const closeModal = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const id = s.list[s.index]?.id;
    morph(() => setState(null), viewerImg, () => thumbOf(id));
  }, []);

  const step = useCallback(async (delta) => {
    const s = stateRef.current;
    if (!s) return;
    const index = (s.index + delta + s.list.length) % s.list.length;
    await preload(s.list[index]?.image?.srcLarge);
    morph(() => setState({ ...s, index }), viewerImg, viewerImg);
  }, []);

  // Fermeture immédiate lors d'un changement de page
  const [openedOn, setOpenedOn] = useState(routeKey);
  if (openedOn !== routeKey) {
    setOpenedOn(routeKey);
    setState(null);
  }

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
