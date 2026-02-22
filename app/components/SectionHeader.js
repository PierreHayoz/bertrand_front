export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left", // "left" | "right" | "center"
}) {
  const alignClass =
    align === "right"
      ? "md:ml-auto md:text-right"
      : align === "center"
      ? "mx-auto text-center"
      : "";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl md:text-4xl font-light text-stone-200">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-stone-400 leading-6">{description}</p>
      ) : null}
    </div>
  );
}
