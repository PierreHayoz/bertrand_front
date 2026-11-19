"use client";

import Image from "next/image";
import { useModal } from "@/context/ModalContext";

/** Légende : n°, titre, format · année. */
export function ArtworkCaption({ oeuvre, className = "" }) {
  const meta = [oeuvre.format, oeuvre.year].filter(Boolean).join(" · ");
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      {oeuvre.numero ? <span className="w-8 shrink-0 text-xs tabular-nums text-faint">{oeuvre.numero}</span> : null}
      <div className="min-w-0">
        {oeuvre.titre ? <p className="leading-snug text-ink">{oeuvre.titre}</p> : null}
        {meta ? <p className="text-sm text-muted">{meta}</p> : null}
      </div>
    </div>
  );
}

/**
 * Image d'une œuvre (proportions réelles) qui ouvre la visionneuse.
 * `data-oeuvre` permet à la visionneuse de retrouver la vignette pour l'animation de retour.
 */
export function ArtworkImage({ oeuvre, list, sizes, priority = false, className = "", imgClassName = "" }) {
  const { openModal } = useModal();
  if (!oeuvre?.image) return null;
  const { src, width, height, alt } = oeuvre.image;

  return (
    <button
      type="button"
      onClick={(e) => openModal(oeuvre, list, e.currentTarget.querySelector("img"))}
      className={`group block w-full overflow-hidden bg-surface ${className}`}
      aria-label={`Agrandir « ${oeuvre.titre} »${oeuvre.numero ? `, n° ${oeuvre.numero}` : ""}`}
      data-oeuvre={oeuvre.id}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`h-auto w-full ${imgClassName}`}
      />
    </button>
  );
}

/** Grille d'œuvres lue de gauche à droite ; chaque œuvre se dévoile en entrant dans l'écran. */
export function ArtworkGrid({ oeuvres, sizes = "(max-width: 768px) 50vw, 25vw" }) {
  if (!oeuvres?.length) return null;
  return (
    <ul data-dim className="grid grid-cols-2 md:grid-cols-4 items-start gap-x-4 gap-y-14 md:gap-x-8 md:gap-y-24">
      {oeuvres.map((o) => (
        <li key={o.id}>
          <figure>
            <div data-reveal="image">
              <ArtworkImage oeuvre={o} list={oeuvres} sizes={sizes} />
            </div>
            <figcaption className="mt-3" data-reveal="fade" data-delay="0.35">
              <ArtworkCaption oeuvre={o} />
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
