/** Rendu du champ « blocks » de Strapi. `lead` agrandit le premier paragraphe. */
export default function BlocksRenderer({ blocks, lead = false }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  return <div className="text-ink">{blocks.map((block, i) => renderBlock(block, i, lead && i === 0))}</div>;
}

function renderBlock(block, key, isLead) {
  if (!block) return null;

  switch (block.type) {
    case "heading": {
      const text = renderChildren(block.children, `${key}-h`);
      if ((block.level ?? 2) <= 2)
        return (
          <h2 key={key} className="t-h3 mt-12 first:mt-0">
            {text}
          </h2>
        );
      return (
        <h3 key={key} className="t-label text-muted mt-10 first:mt-0">
          {text}
        </h3>
      );
    }

    case "paragraph": {
      const children = renderChildren(block.children, `${key}-p`);
      const empty = !block.children?.some((c) => c.text?.trim() || c.type === "link");
      if (empty) return null;
      return (
        <p
          key={key}
          className={
            isLead
              ? "font-serif text-[clamp(1.5rem,2.3vw,2.125rem)] leading-[1.25] mb-8"
              : "mt-5 first:mt-0 text-[1.0625rem] md:text-lg leading-relaxed text-muted [&_strong]:text-ink [&_strong]:font-medium"
          }
        >
          {children}
        </p>
      );
    }

    case "list": {
      const Tag = block.format === "ordered" ? "ol" : "ul";
      return (
        <Tag key={key} className={`mt-5 pl-5 space-y-2 text-muted ${Tag === "ol" ? "list-decimal" : "list-disc"}`}>
          {block.children?.map((item, i) => (
            <li key={i}>{renderChildren(item.children, `${key}-li-${i}`)}</li>
          ))}
        </Tag>
      );
    }

    case "quote":
      return (
        <blockquote key={key} className="mt-8 border-l-2 border-accent pl-5 font-serif italic text-2xl">
          {renderChildren(block.children, `${key}-q`)}
        </blockquote>
      );

    default:
      return null;
  }
}

function renderChildren(children, keyPrefix) {
  if (!Array.isArray(children)) return null;

  return children.map((child, idx) => {
    if (!child) return null;
    const k = `${keyPrefix}-${idx}`;

    if (child.type === "text") {
      let node = child.text;
      if (child.bold) node = <strong>{node}</strong>;
      if (child.italic) node = <em>{node}</em>;
      if (child.underline) node = <u>{node}</u>;
      if (child.strikethrough) node = <s>{node}</s>;
      if (child.code) node = <code className="px-1 rounded-sm bg-surface">{node}</code>;
      return <span key={k}>{node}</span>;
    }

    if (child.type === "link") {
      return (
        <a key={k} href={child.url} target="_blank" rel="noreferrer" className="text-ink underline underline-offset-4">
          {renderChildren(child.children, `${k}-a`)}
        </a>
      );
    }

    return null;
  });
}
