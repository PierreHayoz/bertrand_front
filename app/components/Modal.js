"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Minimize2 } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  instantClose = false,
  src,
  title,
  date,
  format,
  numero,
}) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] },
      }}
      exit={
        instantClose
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } }
      }
      className="fixed inset-0 bg-black z-9999"
      role="dialog"
      aria-modal="true"
    >
      {/* Layout plein écran */}
      <div className="h-full w-full bg-stone-950 px-8">
        {/* Ici tu gères tes paddings */}
        <div className="h-full w-full flex items-center justify-center">
          {/* Bloc centré */}
          <div className="flex flex-col items-start">
            {/* IMAGE */}
            <motion.button
              onClick={onClose}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative cursor-pointer"
              layout
            >
              <Image
                src={src}
                width={500}
                height={500}
                alt={title || "Œuvre"}
                priority
                loading="eager"
                className="w-auto h-auto max-h-[calc(100vh-18rem)]"
              />

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ ease: [0.85, 0, 0.15, 1], duration: 0.2 }}
                    className="absolute inset-0 flex justify-center items-center"
                  >
                    <div className="backdrop-blur-sm bg-stone-200 text-stone-950 px-6 py-6 rounded-full">
                      <Minimize2 size={20} strokeWidth={1.4} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* META — sous l’image, aligné à gauche */}
            <div className="mt-4">
              <div>
                <span className="text-stone-400 text-sm pr-2">{numero}.</span>
                <span className="first-letter:uppercase text-stone-200 text-xl">{title}</span>
              </div>

              <div className="mt-2 flex gap-6">
                <div className="text-stone-400 text-sm">{format}</div>
                <div className="text-stone-400 text-sm">{date}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
