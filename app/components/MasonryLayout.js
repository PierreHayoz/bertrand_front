"use client";
import useMasonry from "../hooks/useMasonry";
import ImageHover from "./ImageHover";

const MasonryLayout = ({ oeuvres }) => {
  const masonryContainer = useMasonry();
  return (
    <div
      ref={masonryContainer}
      className="grid items-start gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
    >
      {oeuvres
        .sort((a, b) => {
          const dateA = new Date(a.date); // Convertir la date de A en objet Date
          const dateB = new Date(b.date); // Convertir la date de B en objet Date
          return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
        })
      .map((oeuvre) => (
        <div key={oeuvre.id} className="relative">
          <ImageHover
            format={oeuvre.Format}
            numero={oeuvre.numero}
            title={oeuvre.Titre}
            date={new Date(oeuvre.date).getFullYear()}
            loading="lazy"
            width={600}
            height={600}
            alt="hello"
            text="afficher"
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image?.url}`}
          />
          
        </div>
      ))}
    </div>
  );
};
export default MasonryLayout;
