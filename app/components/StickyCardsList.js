"use client";

import React from "react";
import StickyCards from "./StickyCards";
import { motion } from "framer-motion";
export default function StickyCardsList({ease, openModal, oeuvres, duration }) {
  return (
    <motion.div
    initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: ease, duration: 1.2, delay: duration/1000 + 0.8 }}
    className="STICKYCARDS h-full p-16 bg-stone-950 ">
      {oeuvres
        .filter((oeuvre) => oeuvre.isAbstract) // Filtrer les œuvres où isAbstract est true
        .sort((a, b) => {
          const dateA = new Date(a.date); // Convertir la date de A en objet Date
          const dateB = new Date(b.date); // Convertir la date de B en objet Date
          return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
        })
        .map((oeuvre) => (
          <StickyCards
            key={oeuvre.id}
            openModal={openModal}
            id={`oeuvre-${oeuvre.id}`}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image.url}`}
            title={oeuvre.Titre}
            date={new Date(oeuvre.date).getFullYear()}
            format={oeuvre.Format}
            alt={oeuvre.Titre}
            duration={duration}
          />
        ))}
    </motion.div>
  );
}
