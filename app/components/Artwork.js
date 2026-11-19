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

/** Image d'une œuvre (proportions réelles) qui ouvre la visionneuse. */
export function ArtworkImage({ oeuvre, list, sizes, priority = false, className = "", imgClassName = "" }) {
  const { openModal } = useModal();
  if (!oeuvre?.image) return null;
  const { src, width, height, alt } = oeuvre.image;

  return (
    <button
      type="button"
      onClick={() => openModal(oeuvre, list)}
      className={`group block w-full overflow-hidden bg-surface ${className}`}
      aria-label={`Agrandir « ${oeuvre.titre} »${oeuvre.numero ? `, n° ${oeuvre.numero}` : ""}`}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] ${imgClassName}`}
      />
    </button>
  );
}

/**
 * Grille d'œuvres lue de gauche à droite (ordre du DOM = ordre visuel).
 * Les colonnes paires glissent à contre-temps au défilement (.drift-grid).
 */
export function ArtworkGrid({ oeuvres, sizes = "(max-width: 768px) 50vw, 25vw" }) {
  if (!oeuvres?.length) return null;
  return (
    <ul className="drift-grid grid grid-cols-2 md:grid-cols-4 items-start gap-x-4 gap-y-14 md:gap-x-8 md:gap-y-24">
      {oeuvres.map((o) => (
        <li key={o.id}>
          <figure>
            <div className="unveil">
              <ArtworkImage oeuvre={o} list={oeuvres} sizes={sizes} />
            </div>
            <figcaption className="mt-3">
              <ArtworkCaption oeuvre={o} />
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
