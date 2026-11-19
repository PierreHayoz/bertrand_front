"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import Modal from "@/app/components/Modal";

const ModalContext = createContext(null);
export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  // { list, index } : la visionneuse permet de passer d'une œuvre à l'autre de la même liste
  const [state, setState] = useState(null);

  const openModal = useCallback((oeuvre, list) => {
    const items = Array.isArray(list) && list.length ? list : [oeuvre];
    const index = Math.max(0, items.findIndex((o) => o.id === oeuvre.id));
    setState({ list: items, index });
  }, []);

  const closeModal = useCallback(() => setState(null), []);

  const step = useCallback((delta) => {
    setState((s) => (s ? { ...s, index: (s.index + delta + s.list.length) % s.list.length } : s));
  }, []);

  // Fermeture lors d'un changement de page
  const [openedOn, setOpenedOn] = useState(routeKey);
  if (openedOn !== routeKey) {
    setOpenedOn(routeKey);
    setState(null);
  }

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);
  const current = state ? state.list[state.index] : null;

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Portail dans <body> : la visionneuse passe au-dessus de l'en-tête fixe */}
      {typeof document !== "undefined"
        ? createPortal(
      <AnimatePresence>
        {current ? (
          <Modal
            key="viewer"
            oeuvre={current}
            position={state.list.length > 1 ? `${state.index + 1} / ${state.list.length}` : null}
            onClose={closeModal}
            onPrev={state.list.length > 1 ? () => step(-1) : null}
            onNext={state.list.length > 1 ? () => step(1) : null}
          />
        ) : null}
      </AnimatePresence>,
            document.body
          )
        : null}
    </ModalContext.Provider>
  );
}
