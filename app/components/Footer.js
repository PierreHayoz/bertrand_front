import React from "react";

export default async function Footer() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/footer?populate=*`
  );
  const footer = await data.json();
  return (
    <div className="FOOTER h-[500px] px-8 md:px-16 pb-16 mdpt-48 pt-16 md:pt-16 bg-stone-200 w-full grid grid-cols-4 md:sticky md:bottom-0 z-0">
      <div className="col-span-4 pr-16 md:col-span-2 col-start-1 text-stone-950  flex flex-col justify-between ">
        <div className="relative z-10  text-xl md:text-3xl  md:leading-9 pointer-events-auto ">
          {footer.data.contactText}
          <br />
          <a
            href={`mailto:${footer.data.Contact.Mail}`}
            className="cursor-pointer font-bold text-blue-500 hover:underline"
          >
            Contactez-moi !
          </a>
        </div>
        <div className="flex">
          <div className="text-stone-950 leading-5">
            <h2>{footer.data.Contact.Phone}</h2>
            <h2>{footer.data.Contact.Mail}</h2>
            <h2>{footer.data.Contact.Address}</h2>
            <h2>{footer.data.Contact.NPA}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
