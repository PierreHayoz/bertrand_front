import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <div
      className={`bg-stone-950 HEADER py-4 z-30 fixed w-full top-0 text-stone-200 `}
    >
      <div className="md:px-16 px-8 flex w-full justify-between items-center">
        <Link href={"/"} className="leading-4 cursor-pointer">
          <div className={` relative group text-xl md:text-2xl font-bold flex items-center`}>
            <div className="transition-all duration-500 absolute h-6 w-6 bg-red-100 scale-x-0 group-hover:scale-x-100 origin-left">
              <Image src="/images/autoportrait.jpg" width={100} height={100} alt="helo" className="w-full h-full object-cover"/>
            </div>
            <div className="transition-all duration-500 group-hover:translate-x-7">Bertrand Kolly</div>
            
          </div>
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
