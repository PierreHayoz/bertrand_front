"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Modal from "./Modal";
import { ArrowBigDown, Expand, ExpandIcon, Maximize2 } from "lucide-react";
export default function ImageHover({
  src,
  title,
  date,
  format,
  numero,
  text,
  modalImageHeight,
  type,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative cursor-pointer group"
      >
        <Image
          src={src}
          width={600}
          height={600}
          alt="Image en grand"
          priority={true}
          className={`${type == 'first' ? 'w-full' : ''} aspect-square group-hover:rounded-lg transition-all duration-500`}
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
              <div className="bg-stone-200 text-stone-950 px-5 py-5 rounded-full">
                <Maximize2 size={20} strokeWidth={1.4} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
