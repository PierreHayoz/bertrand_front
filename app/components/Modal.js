import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
export default function Modal({ isModalOpen, closeModal, selectedImage }) {
  return (
        <motion.div
          key="modal"
          initial={{ y: "100%" }}
          animate={{ y: 0,transition: { duration: 0.4 } }}
          exit={{ y: '-100%',transition: { duration: 0.2 }  }}
          transition={{ ease: [0.33, 1, 0.68, 1]}}
          className="cursor-pointer fixed h-screen inset-0 bg-stone-950 flex justify-center items-center z-50"
          onClick={closeModal}
           // Fermer la modale si on clique sur le fond
        >
          <motion.div
          initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"}} // Initialisation avant que l'élément soit visible
          animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", transition: { duration: 0.8, delay: 0.4, ease:[0.76, 0, 0.24, 1] }}}
          exit={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",transition: { duration: 0.2 } }} // Initialisation avant que l'élément soit visible
          transition={{ }}
            className="h-full p-4 md:p-8 flex items-center"
            onClick={(e) => e.stopPropagation()} // Empêcher la fermeture si on clique sur l'image
          >
            <Image
              src={selectedImage} // Utiliser l'URL de l'image sélectionnée
              width={1000}
              height={1000}
              alt="Image en grand"
              className="md:h-full w-full md:w-auto cursor-default"
            />
            <button
              onClick={closeModal}
              className="absolute text-6xl top-0 right-16 text-white font-thin"
            >
              &times; {/* Symbole pour fermer */}
            </button>
          </motion.div>
        </motion.div>
  );
}
