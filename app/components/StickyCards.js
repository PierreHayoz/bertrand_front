"use client";
import { useState } from "react";
import Image from "next/image";

export default function StickyCards({
  src,
  title,
  date,
  medium,
  format,
  alt,
  id,
  openModal,
}) {

  return (
    <div className="sticky top-16 py-16 px-4 md:px-16 bg-stone-950 z-50">
      <div className="md:flex relative ">
        <div className="md:w-1/2 ">
          <div className="w-full flex justify-between ">
            <h2 className="text-2xl text-stone-200 font-medium leading-4">
              {title}
            </h2>
            <p className="text-stone-400 md:hidden block">{date}</p>
          </div>
          <p className="text-stone-400 text-sm">
            {medium}, {format}
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
