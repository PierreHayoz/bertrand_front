"use client";
import { createContext, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@/app/components/Modal";

// Création du contexte
const ModalContext = createContext();

// Hook pour utiliser le contexte
export function useModal() {
  return useContext(ModalContext);
}

// Provider pour gérer l'état global du modal
export function ModalProvider({ children }) {
  const [isImageClicked, setIsImageClicked] = useState(false);
  const [imageClicked, setImageClicked] = useState(null);
  const openModal = (oeuvre) => {
    console.log("🟢 Ouverture du modal avec image:", oeuvre.Image.url);
  
    // Mise à jour de l'état
    setImageClicked(oeuvre);  // Assure-toi que `oeuvre` est bien ce que tu veux
    setIsImageClicked(true);
  };
  

  const closeModal = () => {
    console.log("🔴 Fermeture du modal");
    setIsImageClicked(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <AnimatePresence>
        {isImageClicked && imageClicked && (
          <Modal
            setIsImageClicked={closeModal}
            isImageClicked={isImageClicked}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${imageClicked.Image.url}`}
            title={imageClicked.Titre}
            date={imageClicked.Date}
            format={imageClicked.Format}
            numero={imageClicked.numero}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
