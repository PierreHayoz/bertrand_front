'use client'
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
export default function Modal({
  setIsImageClicked, // Fonction pour fermer le modal
  isImageClicked,
  src,
  title,
  date,
  format,
  numero,
}) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isImageClicked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isImageClicked]);

  if (!isImageClicked) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
      exit={{ y: "-100%", transition: { ease: [0.25, 1, 0.5, 1], duration: 0.6 } }}
      className="fixed MODAL top-0 left-0 h-screen w-screen bg-stone-950 z-50 p-4 md:p-0"
    >
      <div className="bg-stone-950 flex h-full w-full items-center justify-center">
        <div>
          <motion.div
            onClick={() => setIsImageClicked(false)}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative cursor-pointer"
          >
            <Image
              className="h-auto w-auto max-h-[80vh]"
              src={src}
              width={600}
              height={600}
              alt="Image en grand"
              priority={true}
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ ease: [0.85, 0, 0.15, 1] }}
                  className="absolute flex justify-center items-center h-full w-full top-0 left-0"
                >
                  <div className="background-semiTransparent text-stone-200 py-2 px-4 rounded-full">
                    fermer
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div>
            <span className="text-stone-400 text-sm pr-1">{numero}.</span>
            <span className="text-stone-200 text-xl">{title}</span>
            <div className="flex justify-between">
              <div className="text-stone-400 text-sm">{format}</div>
              <div className="text-stone-400 text-sm">{date}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
