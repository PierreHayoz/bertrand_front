import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header({duration , ease}) {
  const [isEnd, setIsEnd] = useState(false);
  const [isBlocked, setIsBlocked] = useState(true);
  console.log(isBlocked)

 
  useEffect(() => {
    const handleScroll = () => {
      // Vérifie si la position de défilement est proche du bas
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight;

      if (scrollPosition >= bottomPosition - 10) {
        setIsEnd(true); // Si proche du bas, on met `isEnd` à `true`
      } else {
        setIsEnd(false); // Sinon, on met `isEnd` à `false`
      }
    };

    // Attache l'événement de défilement
    window.addEventListener("scroll", handleScroll);

    // Cleanup lorsque le composant est démonté
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
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ease: ease,  duration: 1.2, delay: duration/1000 + 0.8 }}
      className=
      {`bg-stone-950 HEADER py-4 z-40 fixed w-full top-0 text-stone-200 `}
      
    >
      <div className="md:px-16 px-4 flex w-full justify-between items-center">
        <div
          className="leading-4 cursor-pointer"
          onClick={scrollToTop} // Ajouter le gestionnaire de clic pour aller en haut
        >
          <div className={` text-2xl font-light`}>Bertrand Kolly</div>
        </div>
        <div
          className="cursor-pointer group flex items-center gap-2"
          onClick={scrollToBottom} // Ajouter le gestionnaire de clic pour aller en bas
        >
          <span className={`${isEnd ? 'translate-x-0' : 'translate-x-4 '} block`}>
            Contact
          </span>
          <span className=
          {`${isEnd ? 'scale-100 duration-400':'scale-0 duration-400'} bg-stone-200 h-1 w-1 rounded-full flex items-center justify-center  overflow-hidden`}
          ></span>
        </div>
      </div>
    </motion.div>
  );
}
