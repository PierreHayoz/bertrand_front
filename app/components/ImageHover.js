"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Modal from "./Modal";
export default function ImageHover({
  src,
  title,
  date,
  format,
  numero,
  text,
  modalImageHeight,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isImageClicked, setIsImageClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)

  
  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  const handleClick = () => {
      setIsImageClicked(true);
    if (isModalOpen){
      setIsImageClicked(false);
    }
  };
  return (
    <>
      <AnimatePresence>
        {isImageClicked && (
          <Modal
            src={src}
            title={title}
            date={date}
            format={format}
            numero={numero}
            setIsImageClicked={setIsImageClicked}
            isImageClicked={isImageClicked}
          />
        )}
      </AnimatePresence>
      <motion.div
        onClick={handleClick}
        onHoverStart={handleHover}
        onHoverEnd={handleHover}
        className="relative cursor-pointer"
      >
        <Image
          src={src}
          width={600}
          height={600}
          alt="Image en grand"
          onLoad={ ()=>console.log('finito') }
          priority={true}
          className={`${modalImageHeight}`}
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
              <div
                
                className="background-semiTransparent text-stone-200 py-2 px-4 rounded-full"
              >
                {text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
