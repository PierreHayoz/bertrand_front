"use client";
import ImageHover from "./ImageHover";

export default function StickyCards({
  src,
  title,
  date,
  format,
  numero,
  onClick,
  zIndex = 10,
}) {
  return (
    <div
      className="sticky top-24 md:top-32 bg-stone-950"
      style={{ zIndex }}
    >
      <div className="md:flex">
        <div className="md:w-1/2 hidden md:block">
          <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
          <span className="text-stone-200">{title}</span>
          <div className="flex justify-between">
            <div className="text-stone-400 text-sm leading-3">{format}</div>
          </div>
        </div>

        <div className="grid grid-cols-4  pt-4">
          <div onClick={onClick} className="md:col-span-2 col-span-4 cursor-pointer">
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
            <span className="text-stone-200">{title}</span>
            <div className="flex justify-between">
              <div className="text-stone-400 text-sm leading-3">{format}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
