"use client";
import { Fragment } from "react";
import { useModal } from "@/context/ModalContext";
import StickyCards from "./StickyCards";

export default function StickyCardsList({ oeuvres }) {
  const { openModal } = useModal();
  if (!oeuvres?.length) return null;

  const items = oeuvres.slice(0, 10);

  return (
    <div className="bg-stone-950 relative space-y-20">
      {items.map((oeuvre, idx) => (
        <Fragment key={oeuvre.id}>
          <StickyCards
            onClick={() => openModal(oeuvre)}
            src={oeuvre.imageUrl}
            alt={oeuvre.imageAlt ?? oeuvre.titre}
            title={oeuvre.titre}
            numero={oeuvre.numero ?? String(idx + 1).padStart(2, "0")}
            date={new Date(oeuvre.date).getFullYear()}
            format={oeuvre.format}
            zIndex={10 + idx} // ✅ plus on avance, plus ça passe au-dessus
          />
        </Fragment>
      ))}
    </div>
  );
}
