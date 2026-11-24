"use client";

import Image from "next/image";
import { prefetchOeuvre, useModal } from "@/context/ModalContext";

/** Légende : n°, titre, format · année. */
export function ArtworkCaption({ oeuvre, className = "" }) {
  const meta = [oeuvre.format, oeuvre.year].filter(Boolean).join(" · ");
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      {/* le numéro est déjà dans le titre « Œuvre nᵒ … » quand l'œuvre n'a pas de titre */}
      {oeuvre.numero && !oeuvre.sansTitre ? (
        <span className="w-8 shrink-0 text-xs tabular-nums text-faint">{oeuvre.numero}</span>
      ) : null}
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
export function ArtworkImage({ oeuvre, list, sizes, priority = false, maxHeight, className = "", imgClassName = "" }) {
  const { openModal } = useModal();
  if (!oeuvre?.image) return null;
  const { width, height, alt } = oeuvre.image;
  // `maxHeight` (ex. "62svh") : l'œuvre prend toute la largeur disponible sans dépasser cette
  // hauteur. Taille calculée depuis les proportions de l'œuvre, jamais depuis le fichier
  // (sur écran haute densité, un fichier source plus petit que prévu rapetissait l'image).
  const fit = maxHeight ? { width: `min(100%, calc(${maxHeight} * ${width / height}))` } : undefined;
  const src = maxHeight ? oeuvre.image.srcLarge : oeuvre.image.src;

  return (
    <button
      type="button"
      // l'intention (survol, focus, toucher) lance déjà le chargement de la grande image
      onPointerEnter={() => prefetchOeuvre(oeuvre)}
      onPointerDown={() => prefetchOeuvre(oeuvre)}
      onFocus={() => prefetchOeuvre(oeuvre)}
      onClick={(e) => openModal(oeuvre, list, e.currentTarget.querySelector("img"))}
      className={`group relative block w-full overflow-hidden bg-surface ${className}`}
      style={fit}
      aria-label={`Agrandir « ${oeuvre.titre} »${oeuvre.numero && !oeuvre.sansTitre ? `, nᵒ ${oeuvre.numero}` : ""}`}
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
