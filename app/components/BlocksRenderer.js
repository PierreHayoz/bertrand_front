export default function BlocksRenderer({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function renderBlock(block, key) {
  if (!block) return null;

  switch (block.type) {
    case "heading": {
      const level = block.level ?? 2;
      const text = renderChildrenToReact(block.children, `${key}-h`);

      const base = "font-light tracking-tight";
      if (level === 1)
        return (
          <h1 key={key} className={`text-3xl  ${base} mt-10 first:mt-0`}>
            {text}
          </h1>
        );
      if (level === 2)
        return (
          <h2 key={key} className={`text-xl ${base} mt-10`}>
            {text}
          </h2>
        );
      if (level === 3)
        return (
          <h3 key={key} className={`text-xl ${base} mt-8`}>
            {text}
          </h3>
        );

      return (
        <div key={key} className="mt-8">
          {text}
        </div>
      );
    }

    case "paragraph": {
      return (
        <p key={key} className="mt-6 text-base md:text-lg opacity-85 leading-relaxed">
          {renderChildrenToReact(block.children, `${key}-p`)}
        </p>
      );
    }

    // fallback si Strapi renvoie d'autres types
    default: {
      // si jamais certains blocs arrivent déjà en "text"
      if (block.type === "text") {
        return (
          <p key={key} className="mt-6 text-base md:text-lg opacity-85 leading-relaxed">
            {block.text}
          </p>
        );
      }

      return null;
    }
  }
}

function renderChildrenToReact(children, keyPrefix) {
  if (!Array.isArray(children)) return null;

  return children.map((child, idx) => {
    if (!child) return null;

    if (child.type === "text") {
      let node = child.text;

      // marks (bold/italic/underline/strikethrough/code) selon Strapi
      if (child.bold) node = <strong>{node}</strong>;
      if (child.italic) node = <em>{node}</em>;
      if (child.underline) node = <u>{node}</u>;
      if (child.strikethrough) node = <s>{node}</s>;
      if (child.code) node = <code className="px-1 py-0.5 rounded bg-white/10">{node}</code>;

      return <span key={`${keyPrefix}-${idx}`}>{node}</span>;
    }

    if (child.type === "link") {
      return (
        <a
          key={`${keyPrefix}-${idx}`}
          href={child.url}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 opacity-90 hover:opacity-100"
        >
          {renderChildrenToReact(child.children, `${keyPrefix}-${idx}-a`)}
        </a>
      );
    }

    return null;
  });
}
