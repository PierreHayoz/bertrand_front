"use client";
import { useRef } from "react";
import ImageHover from "./ImageHover";
import {
  cubicBezier,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
export default function StickyCards({ src, title, date, format, numero, onClick }) {
  return (
    <div 
      className=" bg-stone-950  md:pb-16 md:pt-0 sticky top-32 z-10"
    >
      <div className="md:flex">
        <div className="md:w-1/2 hidden md:block">
          <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
          <span className="text-stone-200">{title}</span>
          <div className="flex justify-between">
            <div className="text-stone-400 text-sm leading-3">{format}</div>
          </div>
        </div>
        <div className="grid grid-cols-4 md:w-1/2 pt-4">
          <div
          onClick={onClick}
          className="md:col-span-2 col-span-4 ">
            <ImageHover
              src={src}
              text="afficher"
              date={date}
              format={format}
              numero={numero}
              title={title}
            />
          </div>
          <p className="hidden md:block text-end text-sm col-span-2 text-stone-400">
            {date}
          </p>
          <div className="md:w-1/2 w-64 md:hidden">
            <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
            <span className="text-stone-200 ">{title}</span>
            <div className="flex justify-between">
              <div className="text-stone-400 text-sm leading-3">{format}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
