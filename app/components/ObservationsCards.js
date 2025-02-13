"use client";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ImageHover from "./ImageHover";
import { useModal } from "@/context/ModalContext";

export default function ObservationsCards({
  src,
  title,
  date,
  format,
  onClick,
  numero,
}) {
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="md:col-span-1 col-span-4 h-full"
      >
        <p className="text-stone-400 text-sm hidden md:inline-block">{date}</p>
        <ImageHover date={date} format={format} numero={numero} title={title} src={src} text="afficher" onClick={onClick} />
        <div className="flex justify-between">
          <div className="">
            <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
            <span className=" text-stone-200 lg:text-md ">{title}</span>
            <div className="text-stone-400 text-sm leading-3">{format}</div>
          </div>
          <div className="text-end flex items-end"></div>
        </div>
      </motion.div>
    </>
  );
}
