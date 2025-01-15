import ObservationsCards from "./ObservationsCards";

export default function ObservationsCardsList({ separation, openModal, oeuvres, citation }) {
  return (
    <div className="grid grid-cols-4 relative gap-2 z-10 bg-stone-950 px-4 md:px-16 md:gap-4 pb-16 pt-8 md:pb-32 md:pt-16">
      <div className="md:col-start-2  col-span-4 md:col-span-2 px-4 md:px-0 text-stone-200 text-xl md:text-4xl pt-8 md:pt-16 md:pb-48 pb-16 md:leading-9 ">
        {separation.Text}
      </div>
      <div className="col-span-1"></div>
      {oeuvres
        .filter((oeuvre) => !oeuvre.isAbstract) // Filtrer les œuvres où isAbstract est false
        .sort((a, b) => {
          const dateA = new Date(a.Date); // Convertir la date de A en objet Date
          const dateB = new Date(b.Date); // Convertir la date de B en objet Date
          return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
        })
        .map((oeuvre, index) => (
          <>
            <ObservationsCards
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
            <div
              className={
                index % 2 === 0
                  ? "hidden md:flex col-span-2"
                  : "hidden md:flex col-span-1"
              }
            >
              {index == 4 && (
                <div className="md:px-8 px-4 h-full flex justify-center items-center">
                  <div className="text-white space-y-2">
                    <h2 className="citation text-3xl leading-7 ">
                      {citation.Citation}
                    </h2>
                    <p className=" text-end pr-8">{citation.Auteur}</p>
                  </div>
                </div>
              )}
            </div>
            <div
              className={
                index % 2 === 0
                  ? "flex md:hidden col-span-4"
                  : "flex md:hidden col-span-1"
              }
            >
              {index == 4 && (
                <div className="md:px-8 px-4 py-8 h-full flex justify-center">
                  <div className="text-white space-y-2 py-8">
                    <h2 className="text-xl leading-6 citation">
                      {citation.Citation}
                    </h2>
                    <p className="text-end pr-8">{citation.Auteur}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ))}
    </div>
  );
}
