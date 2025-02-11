"use client";
import React from "react";
import StickyCards from "./StickyCards";


export default function StickyCardsList({ oeuvres }) {
  
  return (
    
      
      <div className="STICKYCARDS h-full px-8 md:px-16 bg-stone-950 ">
        {oeuvres
          .filter((oeuvre) => oeuvre.isAbstract) // Filtrer les œuvres où isAbstract est true
          .sort((a, b) => {
            const dateA = new Date(a.date); // Convertir la date de A en objet Date
            const dateB = new Date(b.date); // Convertir la date de B en objet Date
            return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
          })
          .slice(0, 10) // Limiter à 10 premières œuvres
          .map((oeuvre) => (
            <StickyCards
              onClick={() => console.log("hello")}
              key={oeuvre.id}
              id={`oeuvre-${oeuvre.id}`}
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image.url}`}
              title={oeuvre.Titre}
              numero={oeuvre.numero}
              date={new Date(oeuvre.date).getFullYear()}
              format={oeuvre.Format}
              alt={oeuvre.Titre}
            />
          ))}
      </div>
    
  );
}
