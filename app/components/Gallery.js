import Image from "next/image";
import { SectionHeading } from "./ui";

/** Galerie de photos (proportions conservées), lue de gauche à droite. */
export default function Gallery({ images = [], label = "Galerie", title = "Images" }) {
  if (!images?.length) return null;
  return (
    <section className="container-site pb-24 md:pb-36">
      <SectionHeading label={label} title={title} />
      <ul className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 items-start gap-4 md:gap-8">
        {images.map((img, i) => (
          <li key={img.src ?? i} className="overflow-hidden bg-surface" data-reveal="image">
            <Image
              src={img.src}
              width={img.width}
              height={img.height}
              alt={img.alt}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="h-auto w-full"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
