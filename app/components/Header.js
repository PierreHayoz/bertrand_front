"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Vérifier si on est arrivé en bas de la page
      if (scrollY + windowHeight >= docHeight - 50) {
        setIsEnd(true);
      } else {
        setIsEnd(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth", // Pour un défilement fluide
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Défiler tout en haut de la page
      behavior: "smooth", // Pour un défilement fluide
    });
  };

  return (
    <motion.div
      className="h-16 fixed w-full right-0 bg-stone-950 z-20 flex items-center"
      animate={{
        backgroundColor: isEnd ? "rgb(231 229 228)" : "rgb(12 10 9)", // Le rouge et le blanc
        color: isEnd ? "rgb(12 10 9)" : "rgb(231 229 228)", // Le rouge et le blanc
      }}
      transition={{
        duration: 0.4, // Durée de l'animation
        ease: [0.5, 1, 0.89, 1], // Type d'animation
      }}
    >
      <div className="md:px-16 px-4 flex w-full justify-between items-center">
        <div
          className="leading-4 cursor-pointer"
          onClick={scrollToTop} // Ajouter le gestionnaire de clic pour aller en haut
        >
          <div className="text-2xl font-light">Bertrand Kolly</div>
        </div>
        <div
          className="cursor-pointer"
          onClick={scrollToBottom} // Ajouter le gestionnaire de clic pour aller en bas
        >
          Contact
        </div>
      </div>
    </motion.div>
  );
}
