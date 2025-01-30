import React from "react";

export default function Footer({ footer }) {
  return (
    <div className="FOOTER h-screen px-4 md:px-16 pb-16 pt-32 bg-stone-200 w-full grid grid-cols-4 sticky bottom-0 -z-10">
      <div className="col-span-4 md:col-span-2 col-start-1 text-stone-950  flex flex-col justify-between ">
        <p className="text-3xl">
          {footer.contactText}
          <br />
          <a
            href={`mailto:${footer.Contact.Mail}`}
            className="cursor-pointer font-bold text-blue-500 hover:underline"
          >
            Contactez-moi !
          </a>
        </p>
        <div className="flex">
          <div className="text-stone-950 leading-5">
            <h2>{footer.Contact.Phone}</h2>
            <h2>{footer.Contact.Mail}</h2>
            <h2>{footer.Contact.Address}</h2>
            <h2>{footer.Contact.NPA}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
