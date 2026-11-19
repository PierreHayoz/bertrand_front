"use client";

import { useLayoutEffect, useRef } from "react";
import { ArtworkCaption } from "./Artwork";

/**
 * Visionneuse plein écran sur <dialog> natif : couche supérieure, focus piégé.
 * Échap, ← et → au clavier. Ouverture/fermeture animées par View Transitions
 * (voir ModalContext) : la vignette se transforme en grande image.
 */
export default function Viewer({ oeuvre, position, onClose, onPrev, onNext }) {
  const ref = useRef(null);
  const isOpen = Boolean(oeuvre);

  // Layout effect : la boîte de dialogue doit être ouverte dans le même rendu
  // que la mise à jour, pour être capturée par la transition.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // le défilement est verrouillé/libéré par ModalContext (autour des transitions)
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-label={oeuvre?.titre ?? "Œuvre"}
      onCancel={(e) => {
        // Échap : on passe par onClose pour profiter de la transition
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") onPrev?.();
        if (e.key === "ArrowRight") onNext?.();
      }}
    >
      {oeuvre ? (
        <div className="flex h-full flex-col">
          <div className="container-site flex h-16 md:h-20 shrink-0 items-center justify-between">
            <span className="t-label tabular-nums text-faint">{position}</span>
            <button type="button" onClick={onClose} className="t-label py-2 text-ink link-underline" autoFocus>
              Fermer
            </button>
          </div>

          <div className="container-site relative flex min-h-0 flex-1 items-center justify-center">
            {oeuvre.image ? (
              // Image déjà générée par Strapi (format « large ») et préchargée : servie telle quelle
              // pour que la transition morphe vers une image décodée.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                data-viewer-img
                src={oeuvre.image.srcLarge}
                alt={oeuvre.image.alt}
                width={oeuvre.image.width}
                height={oeuvre.image.height}
                className="max-h-full max-w-full w-auto h-auto object-contain"
                decoding="sync"
              />
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
                <button type="button" onClick={onPrev} className="t-label py-2 link-underline">
                  ← Précédente
                </button>
                <button type="button" onClick={onNext} className="t-label py-2 link-underline">
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
