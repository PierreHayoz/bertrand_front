"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const [isEnd, setIsEnd] = useState(false);
  const [test, setTest] = useState(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
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
      top: document.documentElement.scrollHeight + 500,
      behavior: "smooth", // Pour un défilement fluide
    });
  };
console.log(document.documentElement.scrollHeight)
console.log(document.documentElement.scrollHeight + 500)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Défiler tout en haut de la page
      behavior: "smooth", // Pour un défilement fluide
    });
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 2.8 }}
      className="text-white py-4 z-40 fixed w-full bg-stone-950 top-0"
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
