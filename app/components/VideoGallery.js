"use client";

import { useRef } from "react";
import { SectionHeading } from "./ui";

/**
 * Vidéos d'une exposition, pensées pour le format portrait (téléphone).
 * Lecteur natif, lecture au clic seulement ; lancer une vidéo met les autres en pause.
 * « #t=0.1 » fait afficher la première image avant la lecture (Safari / iPhone compris).
 */
export default function VideoGallery({ videos = [], label = "Exposition", title = "Vidéos" }) {
  const list = useRef(null);
  if (!videos.length) return null;

  const pauseOthers = (e) => {
    list.current?.querySelectorAll("video").forEach((v) => {
      if (v !== e.currentTarget && !v.paused) v.pause();
    });
  };

  // Une seule vidéo : centrée et moins large ; sinon grille.
  const single = videos.length === 1;

  return (
    <section className="container-site pb-24 md:pb-36">
      <SectionHeading label={label} title={title} />
      <ul
        ref={list}
        className={
          single
            ? "mt-12 md:mt-16 flex justify-center"
            : "mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-6 md:gap-8"
        }
      >
        {videos.map((v, i) => (
          <li key={v.src ?? i} className={`flex justify-center ${single ? "w-full max-w-md" : ""}`} data-reveal="fade" data-delay={i * 0.08}>
            <video
              className="h-auto bg-surface"
              // toute la largeur de la colonne, sans dépasser 80 % de la hauteur d'écran
              style={{ aspectRatio: v.ratio, width: `min(100%, calc(80svh * ${v.ratio}))` }}
              controls
              playsInline
              preload="metadata"
              aria-label={v.label}
              onPlay={pauseOthers}
            >
              <source src={`${v.src}#t=0.1`} type={v.mime} />
              Votre navigateur ne peut pas lire cette vidéo.{" "}
              <a href={v.src} className="underline">
                Télécharger la vidéo
              </a>
              .
            </video>
          </li>
        ))}
      </ul>
    </section>
  );
}
