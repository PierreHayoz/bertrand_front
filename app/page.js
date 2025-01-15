import Content from "./components/Content";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StickyCardsList from "./components/StickyCardsList";

export default async function Home() {
  const resOeuvres = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/oeuvres?populate=*`,
    {
      cache: "no-store",
    }
  );
  const oeuvres = await resOeuvres.json();
  const resHeader = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/header`,
    {
      cache: "no-store",
    }
  );
  const header = await resHeader.json();
  const resCitation = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/citation`,
    {
      cache: "no-store",
    }
  );
  const citation = await resCitation.json();

  const resFooter = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/footer?populate=*`,
    {
      cache: "no-store",
    }
  );
  const footer = await resFooter.json();

  const resSeparation = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/separation?populate=*`,
    {
      cache: "no-store",
    }
  );
  const separation = await resSeparation.json();

  console.log(separation.data)
  return (
    <>
      <Content
        header={header.data}
        oeuvres={oeuvres.data}
        citation={citation.data}
        footer={footer.data}
        separation={separation.data}
      />
    </>
  );
}
