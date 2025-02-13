import {
  ArrowBigRight,
  ArrowRight,
  MoveRight,
  MoveUpRight,
} from "lucide-react";
import Link from "next/link";
export default function Separation({ separation }) {
  return (
    <div className="flex flex-col gap-4 text-stone-200 md:col-start-2 col-span-4 md:col-span-2 md:pb-32 pb-16 pt-8 px-4 md:pt-8 ">
      <div className="text-xl md:text-3xl  md:leading-9 ">
        {separation.Text}
      </div>
      <Link href={'/playground'}>
      <div className="transition-all duration-500 group flex self-start items-center gap-2 border-stone-200 border w-fit px-4 py-2 rounded-full hover:bg-stone-200 hover:text-stone-950 cursor-pointer">
        <div className="">Voir les oeuvres</div>
        <ArrowRight className="w-0 group-hover:w-4 transition-all duration-500" />
      </div>
      </Link>
    </div>
  );
}
