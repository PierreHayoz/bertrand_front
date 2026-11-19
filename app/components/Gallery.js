import Image from "next/image";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";

/** Galerie de photos en colonnes, proportions conservées. */
export default function Gallery({ images = [], label = "Galerie", title = "Images" }) {
  if (!images?.length) return null;
  return (
    <section className="container-site pb-24 md:pb-36">
      <Reveal>
        <SectionHeading label={label} title={title} />
      </Reveal>
      <div className="mt-12 md:mt-16 columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-8">
        {images.map((img, i) => (
          <Reveal key={img.src ?? i} className="mb-4 md:mb-8 break-inside-avoid" delay={(i % 3) * 0.06}>
            <figure className="bg-surface overflow-hidden">
              <Image
                src={img.src}
                width={img.width}
                height={img.height}
                alt={img.alt}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full"
              />
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
