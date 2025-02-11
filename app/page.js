import HeroMain from "./components/HeroMain";
import Hero from "./components/HeroMain";
import ObservationsCardsList from "./components/ObservationsCardsList";
import StickyCardsList from "./components/StickyCardsList";

export default async function Home() {
  

  const data = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/selection?populate[Observations].Image?[populate]=*&populate[Abstraites].Image?[populate]=*`, {cache: 'no-store'}
  );

  const res = await data.json();
  const oeuvres = res.data
  
  return (
    <>
      <HeroMain/>
      <StickyCardsList oeuvres={oeuvres.Abstraites}/>
      <ObservationsCardsList oeuvres={oeuvres.Observations}/>
    </>
  );
}
