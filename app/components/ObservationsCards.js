"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ObservationsCards({
  src,
  title,
  date,
  format,
  openModal,
}) {
  // Crée une référence pour l'élément


  return (
    <div className="md:col-span-1 col-span-4 h-full">
      <Image
        src={src}
        width={1000}
        height={1000}
        alt="Image en grand"
        className="w-full cursor-pointer border-2 border-stone-700  transition-all duration-700"
        onClick={() => openModal(src)}
      />
      <div className="flex justify-between">
        <div className="leading-4">
          <p className="font-medium text-stone-200">{title}</p>
          <p className="text-stone-400 text-sm">{format}</p>

        </div>
        <div className="text-end leading-4">
          <p className="text-stone-200">{date}</p>
        </div>
      </div>
    </div>
  );
}
