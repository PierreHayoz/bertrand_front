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
  const dataCitation = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/citation?populate=*`
  );
  const resCitation  = await dataCitation.json();
  const citation = resCitation.data;

  const dataSeparation = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/separation?populate=*`
  );
  const resSeparation = await dataSeparation.json();
  const separation = resSeparation.data;
  return (
    <>
      <HeroMain/>
      <StickyCardsList oeuvres={oeuvres.Abstraites}/>
      <ObservationsCardsList separation={separation} oeuvres={oeuvres.Observations} citation={citation}/>
    </>
  );
}
