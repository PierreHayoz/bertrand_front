import Link from "next/link";
import ScrollToBottom from "./ScrollToBottom";

export default function Header() {
  return (
    <div
      className={`bg-stone-950 HEADER py-4 z-30 fixed w-full top-0 text-stone-200 `}
    >
      <div className="md:px-16 px-8 flex w-full justify-between items-center">
        <Link
          href={"/"}
          className="leading-4 cursor-pointer"
        >
          <div className={` text-xl md:text-2xl font-light`}>Bertrand Kolly</div>
        </Link>
        <Link href={"/playground"}>Les oeuvres</Link>
        {/* <ScrollToBottom/> */}
      </div>
    </div>
  );
}
