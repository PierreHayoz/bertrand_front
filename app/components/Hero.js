'use client'
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero({ header }) {
  useEffect(() => {
    // Bloquer le scroll
    const blockScroll = () => {
      document.body.style.overflow = "hidden";
    };
    // Débloquer le scroll
    const unblockScroll = () => {
      document.body.style.overflow = "";
    };

    blockScroll(); // Activer le blocage

    // Débloquer après 1.8 secondes
    const timer = setTimeout(() => {
      unblockScroll();
    }, 1000);

    // Cleanup pour éviter les effets indésirables
    return () => {
      clearTimeout(timer);
      unblockScroll();
    };
  }, []);

  return (
    <div className="grid gap-8 grid-cols-3 md:grid-cols-4 pt-32 md:py-32 px-4 md:px-16 bg-stone-950 md:space-y-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 2, // Durée de l'animation
          ease: [0.5, 1, 0.89, 1], // Type d'animation
        }}
        className="md:leading-9 text-xl leading-6 md:text-4xl md:col-span-2 col-span-2 text-stone-200"
      >
        {header.mainTitle}
      </motion.div>
      <div className="col-span-2"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1, // Durée de l'animation
          ease: [0.5, 1, 0.89, 1],
          delay: 0.8, // Type d'animation
        }}
        className="md:leading-5 md:text-xl leading-5 md:col-start-3 col-start-2 col-span-2 md:col-span-1 text-stone-400 test-light"
      >
        {header.mainSubtitle}
      </motion.div>
    </div>
  );
}