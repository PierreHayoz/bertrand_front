'use client'
import React from "react";
import { Playfair_Display } from "next/font/google";
import Reveal from "./Reveal";


export default function Citation({ citation, auteur, index }) {
  return (
    <>
      {/* Desktop */}
      <div
        className={
          index % 2 === 0
            ? "hidden md:flex col-span-2"
            : "hidden md:flex col-span-1"
        }
      >
        {index === 2 && (
          <Reveal>
          <div className="md:px-8 px-4 h-full flex justify-center items-center">
            <div className="text-white space-y-2">
              <blockquote
                className={`text-2xl leading-7`}
              >
                “{citation}”
              </blockquote>
              <figcaption className="text-end pr-8 text-sm text-stone-300">
                — {auteur}
              </figcaption>
            </div>
          </div>
          </Reveal>
        )}
      </div>

      {/* Mobile */}
      <div
        className={
          index % 2 === 0
            ? "flex md:hidden col-span-4"
            : "flex md:hidden col-span-2"
        }
      >
        {index === 4 && (
          <div className="md:px-8 px-4 py-16 h-full flex justify-center">
            <div className="text-white space-y-2 py-8">
              <blockquote
                className={`text-xl leading-6`}
              >
                “{citation}”
              </blockquote>
              <figcaption className="text-end pr-8 text-sm text-stone-300">
                — {auteur}
              </figcaption>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
