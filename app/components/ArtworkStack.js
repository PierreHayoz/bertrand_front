import { ArtworkCaption, ArtworkImage } from "./Artwork";

/**
 * « À parcourir lentement » : les œuvres s'empilent au défilement (position sticky) ;
 * la carte recouverte recule et s'estompe (animation dans Motion.js, data-stack).
 */
export default function ArtworkStack({ oeuvres }) {
  if (!oeuvres?.length) return null;
  const n = String(oeuvres.length).padStart(2, "0");

  return (
    <ol data-stack>
      {oeuvres.map((o, i) => {
        const pos = `${String(i + 1).padStart(2, "0")} / ${n}`;
        return (
          <li key={o.id} className="sticky" style={{ top: `calc(5.5rem + ${i} * 0.6rem)` }}>
            <div className="origin-top bg-bg border-t border-line pt-5 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4">
              <div className="md:col-span-3 flex md:block items-baseline justify-between gap-4">
                <ArtworkCaption oeuvre={o} />
                <span className="md:hidden t-label text-faint tabular-nums">{pos}</span>
              </div>
              <div className="md:col-span-6 flex justify-center" data-reveal="image">
                <ArtworkImage
                  oeuvre={o}
                  list={oeuvres}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-auto! max-w-full"
                  imgClassName="max-h-[62vh] w-auto! max-w-full"
                />
              </div>
              <p className="hidden md:block md:col-span-3 text-right t-label text-faint tabular-nums">{pos}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
