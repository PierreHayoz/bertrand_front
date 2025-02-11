import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ImageHover from "./ImageHover";

export default function Modal({
  setIsImageClicked,
  isImageClicked,
  src,
  title,
  date,
  format,
  numero,
}) {
    const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (isImageClicked) {
      document.body.style.overflow = "hidden"; // Bloque le scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isImageClicked]);
  if (!isImageClicked) return null;

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{
        y: 0,
        transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      }}
      exit={{
        y: "-100%",
        transition: { ease: [0.25, 1, 0.5, 1], duration: 0.6 },
      }}
      className="fixed top-0 left-0 h-screen w-screen bg-stone-950 z-[100] p-4 md:p-0"
    >
      <div
        // Initialisation avant que l'élément soit visible
        className="bg-stone-950 flex h-full w-full items-center justify-center"
      >
        <div className=" ">
          <motion.div
            onClick={()=>setIsImageClicked(false)}
            onHoverStart={handleHover}
            onHoverEnd={handleHover}
            className="relative cursor-pointer"
          >
            <Image
              src={src}
              width={600}
              height={600}
              alt="Image en grand"
              onLoad={() => console.log("finito")}
              priority={true}
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ ease: [0.85, 0, 0.15, 1] }}
                  className="h-full w-full absolute flex justify-center items-center top-0 left-0"
                >
                  <div className="background-semiTransparent text-stone-200 py-2 px-4 rounded-full">
                    fermer
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div>
            <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
            <span className=" text-stone-200 text-xl">{title}</span>
            <div className="flex justify-between">
              <div className="text-stone-400 text-sm leading-3">{format}</div>
              <div className="text-stone-400 text-sm leading-3">{date}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
