import Image from "next/image";
import BlocksRenderer from "../components/BlocksRenderer";
import Gallery from "../components/Gallery";
import Reveal from "../components/Reveal";
import { CtaBand, PageHeader, Quote } from "../components/ui";
import { getAbout } from "../lib/about";

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
          <Reveal className="md:col-span-5">
            <figure className="bg-surface md:sticky md:top-28">
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
          </Reveal>
        ) : null}

        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          <BlocksRenderer blocks={about.contenu} lead />
        </Reveal>
      </section>

      <Quote text={about.citation.text} auteur={about.citation.auteur} />

      <Gallery images={about.gallery} label="Atelier" title="Au travail" />

      <CtaBand cta={about.cta} />
    </main>
  );
}
