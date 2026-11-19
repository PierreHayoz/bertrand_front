import Image from "next/image";
import Reveal from "../components/Reveal";
import TransitionLink from "../components/TransitionLink";
import { PageHeader, SectionHeading, StatusLabel } from "../components/ui";
import { getExpositions } from "../lib/expositions";
import { formatDateRange, getExpoStatus, place, toDate } from "../lib/utils";

export const metadata = {
  title: "Expositions",
  description: "Expositions de Bertrand Kolly : en cours, à venir et passées.",
};

export default async function ExpositionsPage() {
  const now = new Date();
  const expositions = ((await getExpositions()) ?? []).map((e) => ({ ...e, status: getExpoStatus(e, now) }));

  const live = expositions
    .filter((e) => e.status === "current" || e.status === "upcoming")
    .sort((a, b) => toDate(a.dateDebut) - toDate(b.dateDebut));
  const past = expositions
    .filter((e) => e.status === "past")
    .sort((a, b) => toDate(b.dateDebut) - toDate(a.dateDebut));

  return (
    <main className="pb-24 md:pb-36">
      <PageHeader
        label="Agenda"
        title="Expositions"
        intro="Où voir les toiles de Bertrand Kolly : expositions en cours, à venir et passées."
      />

      <section className="container-site">
        <Reveal>
          <SectionHeading label="Agenda" title="En cours et à venir" />
        </Reveal>
        {live.length ? (
          <ExpoList expos={live} />
        ) : (
          <p className="mt-8 mb-4 t-lead text-muted max-w-[52ch]">
            Aucune exposition annoncée pour le moment.
          </p>
        )}
      </section>

      {past.length ? (
        <section className="container-site mt-20 md:mt-32">
          <Reveal>
            <SectionHeading label="Archives" title="Expositions passées" />
          </Reveal>
          <ExpoList expos={past} />
        </section>
      ) : null}
    </main>
  );
}

function ExpoList({ expos }) {
  return (
    <ul className="mt-6">
      {expos.map((expo) => (
        <li key={expo.id} className="border-b border-line">
          <Reveal>
            <TransitionLink
              href={`/expositions/${expo.slug}`}
              label={expo.titre}
              className="group grid grid-cols-[5.5rem_1fr] md:grid-cols-12 gap-5 md:gap-8 py-8 md:py-10 items-center"
            >
              <div className="md:col-span-2 overflow-hidden bg-surface">
                {expo.cover ? (
                  <Image
                    src={expo.cover.src}
                    width={expo.cover.width}
                    height={expo.cover.height}
                    alt={expo.cover.alt}
                    sizes="(max-width: 768px) 88px, 16vw"
                    className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="aspect-[3/4]" />
                )}
              </div>
              <div className="min-w-0 md:col-span-6">
                <StatusLabel status={expo.status} />
                <h3 className="mt-2 t-h3 text-ink text-balance">{expo.titre}</h3>
              </div>
              <div className="col-start-2 md:col-start-auto md:col-span-3 text-muted text-[0.95rem]">
                <p>{formatDateRange(expo.dateDebut, expo.dateFin)}</p>
                <p>{place(expo)}</p>
              </div>
              <span
                aria-hidden="true"
                className="hidden md:block md:col-span-1 text-right text-2xl text-ink transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </TransitionLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
