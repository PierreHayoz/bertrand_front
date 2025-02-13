'use client'
import React from "react";

export default function Citation({citation, index }) {
  
  return (
    <>
      <div
        className={
          index % 2 === 0
            ? "hidden md:flex col-span-2"
            : "hidden md:flex col-span-1"
        }
      >
        {index == 2 && (
          <div className="md:px-8 px-4 h-full flex justify-center items-center">
            <div className="text-white space-y-2">
              <h2 className="citation text-3xl leading-7 ">
                {citation.Citation}
              </h2>
              <p className=" text-end pr-8">{citation.Auteur}</p>
            </div>
          </div>
        )}
      </div>
      <div
        className={
          index % 2 === 0
            ? "flex md:hidden col-span-4"
            : "flex md:hidden col-span-2"
        }
      >
        {index == 4 && (
          <div className="md:px-8 px-4 py-16 h-full flex justify-center">
            <div className="text-white space-y-2 py-8">
              <h2 className="text-2xl leading-6 citation">
                {citation.Citation}
              </h2>
              <p className="text-end pr-8">{citation.Auteur}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
