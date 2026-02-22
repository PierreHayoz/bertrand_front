'use client'
import { Fragment } from "react";
import Citation from "./Citation";
import ObservationsCards from "./ObservationsCards";
import { useModal } from "@/context/ModalContext";

export default function ObservationsCardsList({ 
  oeuvres, citation }) {
  const { openModal } = useModal()
  console.log(citation)
  return (
    <div className="bg-stone-950 grid grid-cols-4 gap-2 relative z-10  md:gap-4  pt-8 md:pt-16">
      {oeuvres
        .sort((a, b) => {
          const dateA = new Date(a.date); // Convertir la date de A en objet Date
          const dateB = new Date(b.date); // Convertir la date de B en objet Date
          return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
        })
        .map((oeuvre, index) => (
          <Fragment key={oeuvre.id}>
            <ObservationsCards
              onClick={() => {
                console.log("🟢 Click sur :", oeuvre);
                openModal(oeuvre);
              }}

              id={`oeuvre-${oeuvre.id}`}
              src={oeuvre.imageUrl}
              title={oeuvre.titre}
              date={new Date(oeuvre.date).getFullYear()}// Affiche uniquement l'année
              format={oeuvre.format}
              numero={oeuvre.numero}
              alt={oeuvre.Titre}
            />
            <Citation
              index={index}
              citation={citation?.text}
              auteur={citation?.auteur}
            />
          </Fragment>
        ))}
    </div>
  );
}
