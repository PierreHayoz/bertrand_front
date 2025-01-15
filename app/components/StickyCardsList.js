"use client";

import React, { useState, useEffect } from "react";
import StickyCards from "./StickyCards";

export default function StickyCardsList({ openModal, oeuvres }) {
  return (
    <div className="h-full relative z-10">
      {oeuvres
        .filter((oeuvre) => oeuvre.isAbstract) // Filtrer les œuvres où isAbstract est true
        .map((oeuvre) => (
          <>
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
          </>
        ))}
    </div>
  );
}
