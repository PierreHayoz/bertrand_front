"use client";
import { useState, useRef, useEffect } from "react";
import Hero from "./Hero";
import Lenis from "lenis";
import StickyCardsList from "./StickyCardsList";
import ObservationsCardsList from "./ObservationsCardsList";
import Modal from "./Modal";
import Footer from "./Footer";
import Intro from "./Intro";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";

export default function Content({oeuvres, header, citation, footer, separation}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Ajouter l'état pour l'image sélectionnée
  const openModal = (src) => {
    setSelectedImage(src); // Mettre à jour l'image sélectionnée
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <Modal
            isModalOpen={isModalOpen}
            selectedImage={selectedImage}
            closeModal={closeModal}
          />
        )}
      </AnimatePresence>
      <Header />
      <Hero header={header}/>
      <StickyCardsList oeuvres={oeuvres} openModal={openModal} />
      <ObservationsCardsList separation={separation} citation={citation} oeuvres={oeuvres} openModal={openModal} />
      <Footer footer={footer}/>
    </>
  );
}
