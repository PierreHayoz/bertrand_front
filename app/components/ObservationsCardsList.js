
import Citation from "./Citation";
import ObservationsCards from "./ObservationsCards";
import Separation from "./Separation";

export default function ObservationsCardsList({ oeuvres}) {

  return (
    <div className="grid grid-cols-4 gap-2  bg-stone-950 px-8 md:px-16 md:gap-4 pb-16 pt-8 md:pb-32 md:pt-16">
      <Separation separation='hello world'/>
      <div className="col-span-1"></div>
      {oeuvres
        .sort((a, b) => {
          const dateA = new Date(a.date); // Convertir la date de A en objet Date
          const dateB = new Date(b.date); // Convertir la date de B en objet Date
          return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
        })
        .map((oeuvre, index) => (
          <>
            <ObservationsCards
              key={oeuvre.id}
              id={`oeuvre-${oeuvre.id}`}
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image.url}`}
              title={oeuvre.Titre}
              date={new Date(oeuvre.date).getFullYear()}// Affiche uniquement l'année
              format={oeuvre.Format}
              numero={oeuvre.numero}
              alt={oeuvre.Titre}
            />
            <Citation index={index}/>
          </>
        ))}
    </div>
  );
}
