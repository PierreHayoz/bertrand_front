'use client'
import Image from 'next/image'
import { useState } from 'react';

function Imagee({ active, handleClick, oeuvre }) {
  return (
    <div
      onClick={handleClick}
      className={`transition-all duration-300 cursor-pointer 
        ${active === null ? 'opacity-100' : active ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 opacity-100 w-1/2 h-auto' : 'opacity-100'}
      `}
      style={{ pointerEvents: active ? 'auto' : 'auto' }}
    >
      <Image
        className="aspect-square object-contain"
        src={oeuvre.imageUrl}
        width={400}
        height={400}
        alt=""
      />
    </div>
  )
}

export default function Grid({ oeuvres }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-4">
        {oeuvres.map((oeuvre, index) => {
          const isActive = activeIndex === index;
          return (
            <Imagee
              key={index}
              oeuvre={oeuvre}
              handleClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              active={isActive}
            />
          )
        })}
      </div>

      {/* Overlay pour rendre le reste plus sombre */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setActiveIndex(null)}
        />
      )}
    </div>
  )
}