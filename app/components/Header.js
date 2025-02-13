import Link from "next/link";
import ScrollToBottom from "./ScrollToBottom";
import { ArrowRight } from "lucide-react";

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
          <div className={` text-xl md:text-2xl font-bold`}>Bertrand Kolly</div>
        </Link>
        <Link href={"/playground"}>

        <div className="transition-all duration-500 group flex self-start items-center gap-2 border-stone-200 border w-fit px-4 py-2 rounded-full hover:bg-stone-200 hover:text-stone-950 cursor-pointer">
        <div className="">Voir les oeuvres</div>
        <ArrowRight className="w-0 group-hover:w-4 transition-all duration-500" />
      </div>
        </Link>
        {/* <ScrollToBottom/> */}
      </div>
    </div>
  );
}
