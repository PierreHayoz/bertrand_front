"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function ExpoGalleryCarousel({ images = [] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
        skipSnaps: true,
          duration: 40, // ← valeur clé (défaut ≈ 25)
    });

    if (!images?.length) return null;

    return (
        <Reveal> 
        <section className="mt-12 md:mt-16 border-t border-stone-900/80 pt-10 md:pt-14">
            <div className="flex items-end justify-between gap-6">
                <div>
                    <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                        Galerie
                    </div>
                    <h2 className="mt-2 text-xl md:text-2xl font-light text-stone-00">
                        Images
                    </h2>
                </div>
            </div>
            <div className="mt-6 relative cursor-pointer">
                <div
                    ref={emblaRef}
                    className="overflow-hidden"
                >
                    <div className="flex gap-4 md:gap-6 items-start">
                        {images.map((img, i) => (
                            <figure
                                key={img.url ?? i}
                                className="shrink-0 rounded-2xl border border-stone-900/80 overflow-hidden bg-stone-950"
                            >
                                <div className="h-[52vh] md:h-[60vh] bg-stone-950 flex">
                                    <Image
                                        src={img.url}
                                        alt={img.alt ?? "Image d'exposition"}
                                        width={2000}
                                        height={2000}
                                        className="h-full w-auto max-w-none select-none"
                                        sizes="(max-width: 768px) 90vw, 60vw"
                                        priority={i === 0}
                                    />
                                </div>

                                {(img.caption || img.credit) ? (
                                    <figcaption className="p-4 border-t border-stone-900/80">
                                        {img.caption ? (
                                            <div className="text-stone-300 leading-6">{img.caption}</div>
                                        ) : null}
                                        {img.credit ? (
                                            <div className="mt-2 text-sm text-stone-500">{img.credit}</div>
                                        ) : null}
                                    </figcaption>
                                ) : null}
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        </Reveal>
    );
}
