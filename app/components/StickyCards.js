"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
export default function StickyCards({
  src,
  title,
  date,
  format,
  alt,
  id,
  openModal,
}) {

  return (
    <motion.div 
    initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{
        duration: 1, // Durée de l'animation
        ease: [0.5, 1, 0.89, 1],
        delay:0.8 // Type d'animation
      }}
    className="sticky top-16 py-4 md:py-16 px-4 md:px-16 bg-stone-950 z-50">
      <div className="md:flex relative ">
        <div className="md:w-1/2 ">
          <div className="w-full flex justify-between ">
            <h2 className="text-xl md:text-2xl text-stone-200 font-medium leading-6 md:leading-4">
              {title}
            </h2>
            <p className="text-stone-400 md:hidden block">{date}</p>
          </div>
          <p className="text-stone-400 text-sm">
            {format}
          </p>
          
        </div>
        <div className="grid grid-cols-4 md:w-1/2 relative pt-4">
          <div
            className="md:col-span-2 col-span-3 border border-stone-700 p-1 relative"
          >
            <Image
            placeholder="blur"
              src={src}
              width={500}
              height={500}
              alt={alt}
              className="w-full cursor-pointer"
              onClick={() => openModal(src)}
            />

          </div>
          <p className="hidden md:block font-medium text-end col-span-2 text-stone-400">
            {date}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
