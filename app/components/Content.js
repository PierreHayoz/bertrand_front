"use client";

import { useState, useEffect } from "react";
import Hero from "./Hero";
import StickyCardsList from "./StickyCardsList";
import ObservationsCardsList from "./ObservationsCardsList";
import Modal from "./Modal";
import Footer from "./Footer";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import Timer from "./Timer";

export default function Content({
  oeuvresUrl,
  headerUrl,
  citationUrl,
  footerUrl,
  separationUrl,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishedTime, setIsFinishedTime] = useState(false);
  const [loadingTimer, setIsLoadingTimer] = useState(0);
  const duration = 1000;
  const ease = [0.16, 1, 0.3, 1]
  const openModal = (src) => {
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Simuler la période minimale d'affichage de 4 secondes
    const timer = setTimeout(() => {}, 3000);

    return () => clearTimeout(timer); // Nettoyer le timeout pour éviter les fuites
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oeuvresRes, headerRes, citationRes, footerRes, separationRes] =
          await Promise.all([
            fetch(oeuvresUrl).then((res) => res.json()),
            fetch(headerUrl).then((res) => res.json()),
            fetch(citationUrl).then((res) => res.json()),
            fetch(footerUrl).then((res) => res.json()),
            fetch(separationUrl).then((res) => res.json()),
          ]);

        setData({
          oeuvres: oeuvresRes.data,
          header: headerRes.data,
          citation: citationRes.data,
          footer: footerRes.data,
          separation: separationRes.data,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [oeuvresUrl, headerUrl, citationUrl, footerUrl, separationUrl]);

  useEffect(() => {
    const calculateHeight = () => {
      console.log(
        "Hauteur après rendu:",
        document.documentElement.scrollHeight
      );
    };
    setTimeout(calculateHeight, 3500);
  }, [data]);

  if (isLoading) {
    return (
      <div className="text-black text-3xl bg-stone-50 w-full h-screen items-center justify-center flex">
        <div className="flex-col justify-center items-center text-center">
          <div className="">0%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full ">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ease: ease, delay: duration / 1000 + 0.4, duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
        className="text-black text-3xl items-center justify-center flex h-screen w-screen fixed bg-stone-50 z-50 top-0"
      >
        <div className=" flex-col justify-center items-center text-center">
          <Timer duration={duration}/>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <Modal
            isModalOpen={isModalOpen}
            selectedImage={selectedImage}
            closeModal={closeModal}
          />
        )}
      </AnimatePresence>
      <div className="bg-stone-950">
      <Header duration={duration} ease={ease}/>

      <Hero header={data.header} duration={duration} ease={ease}/>
      <StickyCardsList oeuvres={data.oeuvres} openModal={openModal} duration={duration} ease={ease}/>
      <ObservationsCardsList
        separation={data.separation}
        citation={data.citation}
        oeuvres={data.oeuvres}
        openModal={openModal}
      />
      </div>
      <Footer footer={data.footer} />
    </div>
  );
}
