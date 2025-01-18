"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ObservationsCards({
  src,
  title,
  date,
  format,
  openModal,
}) {
  // Crée une référence pour l'élément
  const ref = useRef();

  // Utilise useInView pour détecter lorsque l'élément entre dans la vue
  const isInView = useInView(ref, {
    once: true, // Le déclenchement se fait une seule fois
    threshold: 0.5, // Le seuil d'entrée dans le viewport, ici 50%
    margin: "0px 100px -50px 0px",
  });
  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }} // Initialisation avant que l'élément soit visible
      animate={{
        clipPath: isInView
          ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      }} // Animation basée sur l'entrée dans la vue
      transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }} // Durée de l'animation
      className="md:col-span-1 col-span-4"
    >
      <Image
        src={src}
        width={1000}
        height={1000}
        alt="Image en grand"
        className="w-full cursor-pointer border-2 border-stone-700  transition-all duration-700"
        onClick={() => openModal(src)}
      />
      <div className="flex justify-between pt-2">
        <div className="leading-4">
          <p className="font-medium text-stone-200">{title}</p>
        </div>
        <div className="text-end leading-4">
          <p className="text-stone-200">{date}</p>
          <p className="text-stone-400 text-sm">{format}</p>
        </div>
      </div>
    </motion.div>
  );
}
