
export default async function Separation() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/separation?populate=*`
  );
  const res = await data.json();
  const separation = res.data;

  return (
    <div
      className="md:col-start-2 col-span-4 md:col-span-2 md:pb-32 pb-16 pt-8 px-4 md:pt-8 text-stone-200 text-xl md:text-3xl  md:leading-9 "
    >
      {separation.Text}
    </div>
  );
}
