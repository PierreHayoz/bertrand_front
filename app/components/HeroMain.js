import { cache } from "react";

export default async function HeroMain({}) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/header?populate=*`, {cache: 'no-store'}
  );
  const hero = await data.json();
  return (
    <div className="HERO px-8 md:px-16 space-y-16 pt-48 pb-32 h-full grid grid-cols-3 md:grid-cols-4  bg-stone-950 md:space-y-16">
      <div className="md:leading-9 text-xl leading-6 md:text-3xl md:col-span-2 col-span-2 text-stone-200">
        {hero.data.mainPageTitle}
      </div>
      <div className="col-span-2"></div>
      <div className=" leading-5 md:col-start-3 col-start-2 col-span-3 md:col-span-1 text-stone-400 test-light">
        {hero.data.mainPageSubtitle}
      </div>
    </div>
  );
}
