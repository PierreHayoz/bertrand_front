import { ArtworkCaption, ArtworkImage } from "./Artwork";

/**
 * « À parcourir lentement » : les œuvres s'empilent au défilement
 * (position sticky), chacune reculant quand la suivante la recouvre.
 */
export default function ArtworkStack({ oeuvres }) {
  if (!oeuvres?.length) return null;
  const n = oeuvres.length;

  return (
    <ol className="stack" style={{ "--n": n }}>
      {oeuvres.map((o, i) => (
        <li
          key={o.id}
          className="stack-card sticky"
          style={{ "--i": i, top: `calc(5.5rem + ${i} * 0.6rem)` }}
        >
          <div className="stack-inner bg-bg border-t border-line pt-5 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4">
            <div className="md:col-span-3 flex md:block items-baseline justify-between gap-4">
              <ArtworkCaption oeuvre={o} />
              <span className="md:hidden t-label text-faint tabular-nums">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </span>
            </div>
            <div className="md:col-span-6 flex justify-center">
              <ArtworkImage
                oeuvre={o}
                list={oeuvres}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-auto! max-w-full"
                imgClassName="max-h-[62vh] w-auto! max-w-full"
              />
            </div>
            <p className="hidden md:block md:col-span-3 text-right t-label text-faint tabular-nums">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
