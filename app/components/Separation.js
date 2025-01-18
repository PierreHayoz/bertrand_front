"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Separation({ separation }) {
  const ref = useRef();

  // Utilise useInView pour détecter lorsque l'élément entre dans la vue
  const isInView = useInView(ref, {
    once: true, // Le déclenchement se fait une seule fois
    threshold: 0.5, // Le seuil d'entrée dans le viewport, ici 50%
    margin: "0px 100px -50px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0 }} // Initialisation avant que l'élément soit visible
      animate={{
        opacity: isInView
          ? 1
          : 0
      }} // Animation basée sur l'entrée dans la vue
      transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
      className="md:col-start-2 col-span-4 md:col-span-2 px-4 md:px-0 text-stone-200 text-xl md:text-4xl pt-8 md:pt-16 md:pb-48 pb-16 md:leading-9 "
    >
      {separation.Text}
    </motion.div>
  );
}
