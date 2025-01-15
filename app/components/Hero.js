import React from "react";

export default function Hero({ header }) {
  return (
    <div className="grid gap-8 grid-cols-3 md:grid-cols-4 pt-32 md:py-32 px-4 md:px-16 bg-stone-950 md:space-y-16 relative z-10">
      <div className="md:leading-9 text-2xl md:text-4xl md:col-span-2 col-span-2 text-stone-200">
        {header.mainTitle}
      </div>
      <div className="col-span-2"></div>
      <div className="md:leading-5 md:text-xl md:col-start-3 col-start-2 col-span-2 md:col-span-1 text-stone-400 test-light">
        {header.mainSubtitle}
      </div>
    </div>
  );
}
