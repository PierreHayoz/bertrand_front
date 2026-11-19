"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Viewer from "@/app/components/Viewer";

const ModalContext = createContext(null);
export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  // { list, index } : on peut passer d'une œuvre à l'autre dans la même liste
  const [state, setState] = useState(null);

  const openModal = useCallback((oeuvre, list) => {
    const items = Array.isArray(list) && list.length ? list : [oeuvre];
    setState({ list: items, index: Math.max(0, items.findIndex((o) => o.id === oeuvre.id)) });
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
