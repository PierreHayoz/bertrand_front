import Hero from "../components/HeroMain";
import HeroOeuvres from "../components/HeroOeuvres";
import MasonryLayout from "../components/MasonryLayout";

export default async function page() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/oeuvres?populate=*`
  );
  const oeuvres = await data.json();

  return (
    <>
      <HeroOeuvres />
      <div className="md:px-16 pb-8 px-8 bg-stone-950">
        <MasonryLayout oeuvres={oeuvres.data} />
      </div>
    </>
  );
}
