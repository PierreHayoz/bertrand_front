"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArtworkCaption } from "./Artwork";

/**
 * Visionneuse plein écran sur <dialog> natif : couche supérieure (au-dessus de tout),
 * focus piégé et Échap gérés par le navigateur. ← → pour naviguer.
 */
export default function Viewer({ oeuvre, position, onClose, onPrev, onNext }) {
  const ref = useRef(null);
  const handlers = useRef({ onPrev, onNext });

  useEffect(() => {
    handlers.current = { onPrev, onNext };
  });

  const isOpen = Boolean(oeuvre);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      globalThis.__lenis?.stop?.();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlers.current.onPrev?.();
    if (e.key === "ArrowRight") handlers.current.onNext?.();
  };

  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-label={oeuvre?.titre ?? "Œuvre"}
      onClose={() => {
        globalThis.__lenis?.start?.();
        onClose();
      }}
      onKeyDown={onKeyDown}
    >
      {oeuvre ? (
        <div className="flex h-full flex-col">
          <div className="container-site flex h-16 md:h-20 shrink-0 items-center justify-between">
            <span className="t-label tabular-nums text-faint">{position}</span>
            <button type="button" onClick={() => ref.current?.close()} className="t-label py-2 text-ink" autoFocus>
              Fermer
            </button>
          </div>

          <div className="container-site relative flex min-h-0 flex-1 items-center justify-center">
            {oeuvre.image ? (
              <div key={oeuvre.id} className="viewer-img relative h-full w-full">
                <Image src={oeuvre.image.srcLarge} alt={oeuvre.image.alt} fill sizes="100vw" className="object-contain" />
              </div>
            ) : null}
            {onPrev ? (
              <button
                type="button"
                onClick={onPrev}
                tabIndex={-1}
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1/3 cursor-w-resize"
              />
            ) : null}
            {onNext ? (
              <button
                type="button"
                onClick={onNext}
                tabIndex={-1}
                aria-hidden="true"
                className="absolute right-0 top-0 h-full w-1/3 cursor-e-resize"
              />
            ) : null}
          </div>

          <div className="container-site flex shrink-0 items-end justify-between gap-6 py-6 md:py-8">
            <ArtworkCaption oeuvre={oeuvre} />
            {onPrev ? (
              <div className="flex gap-6 text-ink">
                <button type="button" onClick={onPrev} className="t-label py-2 hover:text-muted">
                  ← Précédente
                </button>
                <button type="button" onClick={onNext} className="t-label py-2 hover:text-muted">
                  Suivante →
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
