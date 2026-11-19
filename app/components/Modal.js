"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArtworkCaption } from "./Artwork";

/** Visionneuse plein écran : Échap pour fermer, ← → pour naviguer. */
export default function Modal({ oeuvre, position, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);
  const handlers = useRef({ onClose, onPrev, onNext });

  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext };
  });

  useEffect(() => {
    const lenis = globalThis.__lenis;
    lenis?.stop?.();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      const h = handlers.current;
      if (e.key === "Escape") h.onClose?.();
      if (e.key === "ArrowLeft") h.onPrev?.();
      if (e.key === "ArrowRight") h.onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start?.();
    };
  }, []);

  const img = oeuvre.image;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="fixed inset-0 z-9999 bg-bg flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={oeuvre.titre ?? "Œuvre"}
    >
      <div className="container-site h-16 md:h-20 flex items-center justify-between shrink-0">
        <span className="t-label text-faint tabular-nums">{position}</span>
        <button ref={closeRef} type="button" onClick={onClose} className="t-label text-ink py-2">
          Fermer
        </button>
      </div>

      <div className="relative flex-1 min-h-0 container-site flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {img ? (
            <motion.div
              key={oeuvre.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="relative h-full w-full"
            >
              <Image
                src={img.srcLarge}
                alt={img.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-0 top-0 h-full w-1/3 cursor-w-resize"
            aria-label="Œuvre précédente"
          />
        ) : null}
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-0 top-0 h-full w-1/3 cursor-e-resize"
            aria-label="Œuvre suivante"
          />
        ) : null}
      </div>

      <div className="container-site shrink-0 py-6 md:py-8 flex items-end justify-between gap-6">
        <ArtworkCaption oeuvre={oeuvre} />
        {onPrev || onNext ? (
          <div className="flex gap-6 text-ink">
            <button type="button" onClick={onPrev} className="t-label py-2 hover:text-muted" aria-label="Œuvre précédente">
              ← Préc.
            </button>
            <button type="button" onClick={onNext} className="t-label py-2 hover:text-muted" aria-label="Œuvre suivante">
              Suiv. →
            </button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
