"use client";
import { useModal } from "@/context/ModalContext";
import StickyCards from "./StickyCards";

export default function StickyCardsList({ oeuvres }) {
  const { openModal } = useModal();

  return (
    <div className="STICKYCARDS relative z-10 h-full px-8 md:px-16 bg-stone-950">
      {oeuvres
        .filter((oeuvre) => oeuvre.isAbstract)
        .slice(0, 10)
        .map((oeuvre) => (
          <StickyCards
            onClick={() => {
              console.log("🟢 Click sur :", oeuvre);
              openModal(oeuvre);
            }}
            key={oeuvre.id}
            id={`oeuvre-${oeuvre.id}`}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image.url}`}
            title={oeuvre.Titre}
            numero={oeuvre.numero}
            date={new Date(oeuvre.date).getFullYear()}
            format={oeuvre.Format}
            alt={oeuvre.Titre}
          />
        ))}
    </div>
  );
}

