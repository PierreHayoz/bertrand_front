'use client'
import Lenis from "lenis";
import Content from "./components/Content";
import { useEffect } from "react";

export default function Home() {

  return (
    <Content
      oeuvresUrl={`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/oeuvres?populate=*`}
      headerUrl={`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/header`}
      citationUrl={`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/citation`}
      footerUrl={`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/footer?populate=*`}
      separationUrl={`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/separation?populate=*`}
    />
  );
}
