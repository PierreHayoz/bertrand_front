export default async function HeroOeuvres({}) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/header?populate=*`,
    { cache: "no-store" }
  );
  const res = await data.json();
  const hero = res.data

  return (
    <div className="HERO relative z-10 px-8 md:px-16 space-y-16 pt-48 md:pb-32 h-full grid grid-cols-3 md:grid-cols-4  bg-stone-950 md:space-y-16">
      <div className="text-xl leading-6 md:text-4xl md:col-span-2 col-span-2 text-stone-200 italic">
        {hero.oeuvresPageTitle}
      </div>
      <div className="col-span-2"></div>
      {hero.oeuvresPageSubtitle && (
        <div className=" leading-5 md:col-start-3 col-start-2 col-span-3 md:col-span-1 text-stone-400 test-light">
          {hero.oeuvresPageSubtitle}
        </div>
      )}
    </div>
  );
}
