"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import Modal from "@/app/components/Modal";

const ModalContext = createContext(null);
export function useModal() { return useContext(ModalContext); }

export function ModalProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [instantClose, setInstantClose] = useState(false);

  const openModal = useCallback((oeuvre /*, _list */) => {
    setInstantClose(false);
    setCurrent(oeuvre ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrent(null);
  }, []);

  // ✅ fermeture due à navigation => pas d'animation de sortie
  useEffect(() => {
    if (!isOpen) return;
    setInstantClose(true);
    // on ferme au prochain tick, après avoir basculé le flag
    queueMicrotask(() => closeModal());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}

      <AnimatePresence mode="sync">
        {isOpen && current && (
          <Modal
            key={current.id ?? current.imageUrl ?? "modal"}
            isOpen={isOpen}
            onClose={closeModal}
            instantClose={instantClose}
            src={current.imageUrl}
            title={current.titre}
            date={current.date ? new Date(current.date).getFullYear() : null}
            format={current.format}
            numero={current.numero}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
