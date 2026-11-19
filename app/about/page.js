import Image from "next/image";
import BlocksRenderer from "../components/BlocksRenderer";
import Gallery from "../components/Gallery";
import { CtaBand, EXPLORE, ExploreLinks, PageHeader, Quote } from "../components/ui";
import { getAbout } from "../lib/content";

export const metadata = {
  title: "À propos",
  description: "Parcours de Bertrand Kolly, artiste peintre né à Fribourg en 1962.",
};

export default async function AboutPage() {
  const about = await getAbout();
  if (!about) return null;

  return (
    <main>
      <PageHeader label="À propos" title={about.hero.title} intro={about.hero.subtitle} />

      <section className="container-site pb-8 md:pb-16 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
        {about.image ? (
          <figure className="md:col-span-5 md:sticky md:top-28 self-start bg-surface">
            <Image
              src={about.image.srcLarge}
              width={about.image.width}
              height={about.image.height}
              alt={about.image.alt}
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="h-auto w-full"
            />
          </figure>
        ) : null}
        <div className="reveal md:col-span-6 md:col-start-7">
          <BlocksRenderer blocks={about.contenu} lead />
        </div>
      </section>

      <Quote quote={about.quote} />

      <Gallery images={about.gallery} label="Atelier" title="Au travail" />

      <CtaBand cta={about.cta} />

      <div className="pt-24 md:pt-36">
        <ExploreLinks links={[EXPLORE.oeuvres, EXPLORE.expositions]} />
      </div>
    </main>
  );
}
