"use client";

import React from "react";
import StickyCards from "./StickyCards";

export default function StickyCardsList({ openModal, oeuvres }) {
  return (
    <div className="h-full relative z-10 pt-16">
      {oeuvres
        .filter((oeuvre) => oeuvre.isAbstract) // Filtrer les œuvres où isAbstract est true
        .sort((a, b) => {
          const dateA = new Date(a.Date); // Convertir la date de A en objet Date
          const dateB = new Date(b.Date); // Convertir la date de B en objet Date
          return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
        })
        .map((oeuvre) => (
          <StickyCards
            key={oeuvre.id}
            openModal={openModal}
            id={`oeuvre-${oeuvre.id}`}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image.url}`}
            title={oeuvre.Titre}
            date={oeuvre.Date}
            medium={oeuvre.Medium}
            format={oeuvre.Format}
            alt={oeuvre.Titre}
          />
        ))}
    </div>
  );
}
