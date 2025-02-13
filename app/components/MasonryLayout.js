"use client";

import { useModal } from "@/context/ModalContext";
import useMasonry from "../hooks/useMasonry";
import ImageHover from "./ImageHover";
import Image from "next/image";

const MasonryLayout = ({ oeuvres }) => {
  const { openModal } = useModal();
  const masonryContainer = useMasonry();

  return (
    <div
      ref={masonryContainer}
      className="md:px-16 px-8 pb-16 bg-stone-950 grid items-start grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-12 relative z-10"
    >
      {oeuvres
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((oeuvre, index) => (
          <div
            key={oeuvre.id}
            className={`relative ${index === 0 ? "col-span-2" : ""}`}
            onClick={() => {
              console.log("🟢 Click sur :", oeuvre);
              openModal(oeuvre);
            }}
          >
            {index === 0 && (
              <div className="flex justify-between flex-col">
              <div className=" text-stone-200 text-xl md:text-2xl pb-4 md:pb-8"><span className="">Ma dernière création :</span> <span className="font-semibold">{oeuvre.Titre}</span></div>
                
              </div>
            )}
            <ImageHover
              type="first"
              format={oeuvre.Format}
              numero={oeuvre.numero}
              title={oeuvre.Titre}
              date={new Date(oeuvre.date).getFullYear()}
              loading="lazy"
              width={600}
              height={600}
              alt="hello"
              text="afficher"
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${oeuvre.Image?.url}`}
            />
          </div>
        ))}
    </div>
  );
};

export default MasonryLayout;
