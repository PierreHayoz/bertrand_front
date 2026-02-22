import ImageHover from "./ImageHover";
import Reveal from "./Reveal";

export default function ObservationsCards({
  src,
  title,
  date,
  format,
  onClick,
  numero,
}) {
  
  return (
    <div className="col-span-4 md:col-span-1">
      <Reveal fromY={40} duration={2}>
        <p className="text-stone-400 text-sm hidden md:inline-block">{date}</p>
        <div onClick={onClick} className="">
        <ImageHover date={date} format={format} numero={numero} title={title} src={src} text="afficher" />
        </div>
        <div className="flex justify-between">
          <div className="">
            <span className="text-stone-400 text-sm pr-1 w-8">{numero}.</span>
            <span className=" text-stone-200 lg:text-md ">{title}</span>
            <div className="text-stone-400 text-sm leading-3">{format}</div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
