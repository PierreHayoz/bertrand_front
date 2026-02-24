// components/ExpoCard.jsx
'use client';
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toPlainText, formatDateRange } from "../lib/utils";

export default function ExpoCard({ expo, status }) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // détecte si on est sur mobile (coarse pointer)
  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    setIsMobile(media.matches);
  }, []);

  // scroll trigger
  const isInView = useInView(ref, { margin: "-40%", once: true });

  const active = isMobile && isInView; // active seulement sur mobile

  const place = [expo.lieu, expo.ville, expo.pays].filter(Boolean).join(", ");
  const dates = formatDateRange(expo.dateDebut, expo.dateFin);
  const href = expo.slug ? `/expositions/${expo.slug}` : null;
  const desc = toPlainText(expo.description);

  const StatusPill = () => {
    const label =
      status === "current" ? "En cours" : status === "upcoming" ? "À venir" : "Passée";

    const cls =
      status === "current"
        ? "border-stone-500 text-stone-200"
        : status === "upcoming"
        ? "border-stone-500 text-stone-200"
        : "border-stone-500 text-stone-500";

    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}>
        {label}
      </span>
    );
  };

  const CardContent = (
    <div
      ref={ref}
      className="rounded-2xl border group border-stone-900/80 relative overflow-hidden hover:border-stone-700 transition-colors"
    >
      {/* overlay */}
      <div
        className={`
          absolute w-full h-full left-0 bg-stone-200 mix-blend-difference top-full duration-500 z-10
          md:group-hover:top-0
          ${active ? "top-0" : "top-full"}
        `}
      />

      {/* content */}
      <div className="relative p-5 md:p-6 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-lg md:text-xl font-light text-stone-200 transition-colors duration-300 truncate">
              {expo.titre}
            </div>
            <StatusPill />
          </div>

          <div className="mt-3 text-sm text-stone-400">
            {dates ? <span>{dates}</span> : null}
            {place ? <span className="text-stone-600"> · </span> : null}
            {place ? <span>{place}</span> : null}
          </div>

          {desc ? (
            <p className="mt-4 text-stone-400 leading-6 line-clamp-2">
              {desc}
            </p>
          ) : null}
        </div>

        <div className="shrink-0">
          <div
            className={`
              relative overflow-hidden px-3 py-1 border border-stone-600 rounded-full flex items-center w-fit transition-all duration-300
              md:group-hover:pr-8
              ${active ? "pr-8" : ""}
            `}
          >
            <span>voir en détail</span>
            <ArrowRight
              size={14}
              className={`
                absolute right-3 transition-all duration-300 ease-out
                opacity-0 -translate-x-1
                md:group-hover:opacity-100 md:group-hover:translate-x-0
                ${active ? "opacity-100 translate-x-0" : ""}
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <a href={href} aria-label={expo.titre}>
      {CardContent}
    </a>
  ) : (
    CardContent
  );
}