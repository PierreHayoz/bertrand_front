import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ImageHover from "./ImageHover";

export default function Modal({
  isModalOpen,
  closeModal,
  setSelectedArt,
  selectedArt,
}) {
  useEffect(() => {
    if (selectedArt) {
      document.body.style.overflow = "hidden"; // Bloque le scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedArt]);
  if (!selectedArt) return null;
console.log(selectedArt.Titre)
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{
        y: 0,
        transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      }}
      exit={{
        y: "-100%",
        transition: { ease: [0.25, 1, 0.5, 1], delay: 0.6, duration: 0.6 },
      }}
      className="fixed top-0 left-0 h-screen w-full bg-stone-950 z-50 p-4 md:p-0"
    >
      <motion.div
        initial={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          y: 200,
        }} // Initialisation avant que l'élément soit visible
        animate={{
          transition: {
            ease: "easeIn",
            duration: 0.6,
            delay: 0.6,
            ease: [0.65, 0, 0.35, 1],
          },
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
        }}
        exit={{
          transition: { ease: [0.25, 1, 0.5, 1], duration: 0.6 },
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          y: 200,
        }} // Initialisation avant que l'élément soit visible
        className="h-full flex items-center justify-center"
      >
        <div className="max-h-[90vh] w-auto h-auto">
          <ImageHover
            onClick={() => setSelectedArt(null)}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${selectedArt.Image.url}`}
            text="fermer"
            modalImageHeight="max-h-[80vh]"
          />
          <div className="">
            <span className="text-stone-400 text-sm pr-1 w-8">{selectedArt.numero}.</span>
            <span className=" text-stone-200 text-xl">{selectedArt.Titre}</span>
            <div className="flex justify-between">
              <div className="text-stone-400 text-sm leading-3">
              {selectedArt.Format}
              </div>
              <div className="text-stone-400 text-sm leading-3">
              {selectedArt.Date}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
