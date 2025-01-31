"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageHover from "./ImageHover";
export default function StickyCards({
  src,
  title,
  date,
  format,
  numero,
  onClick
}) {
  return (
    <div className="sticky top-32 bg-stone-950 p-4 md:p-0">
      <div className="md:flex ">
        <div className="md:w-1/2 ">
        <div className="">
            <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
            <span className=" text-stone-200">{title}</span>
            <div className="flex justify-between">
              <div className="text-stone-400 text-sm leading-3">
              {format}
              </div>
              
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 md:w-1/2 relative pt-4">
          <div className="md:col-span-2 col-span-4 border border-stone-700 p-1 relative">
            <ImageHover src={src} text="afficher" onClick={onClick} />
          </div>
          <p className="hidden md:block text-end text-sm col-span-2 text-stone-400">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}
