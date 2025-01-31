"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
export default function ImageHover({ onClick, openModal, src, text, modalImageHeight }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  console.log(isButtonHovered);
  return (
    <motion.div
      onHoverStart={handleHover}
      onHoverEnd={handleHover}
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <Image
        loading="lazy"
        src={src}
        width={600}
        height={600}
        alt="Image en grand"
        className={`${modalImageHeight} transition-all duration-700  h-auto w-auto`}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 1, opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ ease: [0.85, 0, 0.15, 1] }}
            className="h-full w-full absolute flex justify-center items-center top-0 left-0"
          >
            <motion.div
              initial={{ padding: "0.5em 1.5em" }}
              animate={{ padding: isButtonHovered ? "2em 1.5em" : "0.5em 1.5em" }}
              onHoverStart={() => {
                setIsButtonHovered(true);
              }}
              onHoverEnd={() => {
                setIsButtonHovered(false);
              }}
              className="background-semiTransparent text-stone-200 "
            >
              {text}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
