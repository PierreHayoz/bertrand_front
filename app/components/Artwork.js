"use client";

import Image from "next/image";
import { useModal } from "@/context/ModalContext";

/** Légende d'une œuvre : n°, titre, format · année. */
export function ArtworkCaption({ oeuvre, className = "" }) {
  const meta = [oeuvre.format, oeuvre.year].filter(Boolean).join(" · ");
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      {oeuvre.numero ? <span className="text-xs tabular-nums text-faint shrink-0">{oeuvre.numero}</span> : null}
      <div className="min-w-0">
        <p className="text-ink leading-snug">{oeuvre.titre}</p>
        {meta ? <p className="text-sm text-muted">{meta}</p> : null}
      </div>
    </div>
  );
}

/** Une œuvre, en proportions réelles, qui ouvre la visionneuse. */
export default function Artwork({ oeuvre, list, sizes, priority = false, caption = true, className = "" }) {
  const { openModal } = useModal();
  if (!oeuvre?.image) return null;

  return (
    <figure className={`group ${className}`}>
      <button
        type="button"
        onClick={() => openModal(oeuvre, list)}
        className="block w-full overflow-hidden bg-surface"
        aria-label={`Agrandir : ${oeuvre.titre ?? "œuvre"}${oeuvre.numero ? `, n° ${oeuvre.numero}` : ""}`}
      >
        <Image
          src={oeuvre.image.src}
          width={oeuvre.image.width}
          height={oeuvre.image.height}
          alt={oeuvre.image.alt}
          sizes={sizes ?? "(max-width: 768px) 50vw, 33vw"}
          priority={priority}
          className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
      </button>
      {caption ? (
        <figcaption className="mt-3">
          <ArtworkCaption oeuvre={oeuvre} />
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Grille en colonnes (proportions conservées, rythme irrégulier façon accrochage). */
export function ArtworkGrid({ oeuvres, cols = "columns-2 md:columns-3", sizes }) {
  if (!oeuvres?.length) return null;
  return (
    <div className={`${cols} gap-4 md:gap-8`}>
      {oeuvres.map((o, i) => (
        <Artwork
          key={o.id}
          oeuvre={o}
          list={oeuvres}
          sizes={sizes}
          className="mb-10 md:mb-14 break-inside-avoid"
          priority={i < 2}
        />
      ))}
    </div>
  );
}
