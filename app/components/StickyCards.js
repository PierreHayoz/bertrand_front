"use client";
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
  duration
}) {

  return (
    <div
    
    className="sticky top-32 bg-stone-950 p-4 md-p8"
    >
      <div className="md:flex ">
        <div className="md:w-1/2 ">
          <div className="w-full flex justify-between gap-4">
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
    </div>
  );
}
