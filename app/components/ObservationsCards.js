"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function ObservationsCards({
  src,
  title,
  date,
  format,
  openModal,
}) {
  // Crée une référence pour l'élément
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="md:col-span-1 col-span-4 h-full"
    >
      <Image
        src={src}
        width={1000}
        height={1000}
        alt="Image en grand"
        className="w-full cursor-pointer border-2 border-stone-700 transition-all duration-700"
        onClick={() => openModal(src)}
      />
      <div className="flex justify-between pt-2">
        <div className="leading-3">
          <p className="font-medium text-stone-200">{title}</p>
          <p className="text-stone-400 text-sm">{format}</p>
        </div>
        <div className="text-end">
          <p className="text-stone-200">{date}</p>
        </div>
      </div>
    </motion.div>
  );
}
