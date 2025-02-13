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
      <div className=" w-full pb-8  bg-red-200 ">
        <MasonryLayout oeuvres={oeuvres.data} />
      </div>
    </>
  );
}
