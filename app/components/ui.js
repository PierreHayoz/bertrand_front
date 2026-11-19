import TransitionLink from "./TransitionLink";

/** En-tête de page : petit libellé + grand titre serif + chapeau. */
export function PageHeader({ label, title, intro, aside }) {
  return (
    <header className="container-site pt-36 md:pt-48 pb-12 md:pb-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
      <div className="md:col-span-8">
        {label ? <p className="t-label text-muted">{label}</p> : null}
        <h1 className="mt-5 t-h1 text-ink text-balance">{title}</h1>
        {intro ? <p className="mt-6 t-lead text-muted max-w-[46ch]">{intro}</p> : null}
      </div>
      {aside ? <div className="md:col-span-4 md:text-right text-muted">{aside}</div> : null}
    </header>
  );
}

/** Titre de section avec filet. */
export function SectionHeading({ label, title, children, className = "" }) {
  return (
    <div className={`border-t border-line pt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${className}`}>
      <div>
        {label ? <p className="t-label text-muted">{label}</p> : null}
        {title ? <h2 className="mt-3 t-h2 text-ink">{title}</h2> : null}
      </div>
      {children}
    </div>
  );
}

/** Lien texte avec flèche. */
export function ArrowLink({ href, children, className = "" }) {
  const isExternal = /^https?:\/\//.test(href ?? "");
  const content = (
    <>
      <span className="link-underline">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  );
  const cls = `group inline-flex items-center gap-2 text-ink ${className}`;
  if (!href) return null;
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={cls}>
      {content}
    </TransitionLink>
  );
}

/** Bandeau d'appel à l'action (contenu Strapi « Appel à l'action »). */
export function CtaBand({ cta }) {
  if (!cta?.title) return null;
  return (
    <section className="bg-accent text-accent-ink">
      <div className="container-site py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <p className="md:col-span-8 t-h2 text-balance">{cta.title}</p>
        <div className="md:col-span-4 md:text-right">
          {cta.text ? <p className="mb-4 opacity-80">{cta.text}</p> : null}
          {cta.url && cta.label ? (
            <TransitionLink
              href={cta.url}
              className="inline-flex items-center gap-3 rounded-full bg-accent-ink text-accent px-6 py-3 transition-transform duration-300 hover:-translate-y-0.5"
            >
              {cta.label}
              <span aria-hidden="true">→</span>
            </TransitionLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Citation en grand. */
export function Quote({ text, auteur }) {
  if (!text) return null;
  return (
    <figure className="container-site py-24 md:py-36">
      <blockquote className="font-serif italic text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.08] tracking-[-0.01em] text-ink max-w-[22ch] mx-auto text-center text-balance">
        « {text} »
      </blockquote>
      {auteur ? <figcaption className="mt-8 text-center t-label text-muted">{auteur}</figcaption> : null}
    </figure>
  );
}

export function StatusLabel({ status }) {
  const label = { current: "En cours", upcoming: "À venir", past: "Passée" }[status];
  if (!label) return null;
  const live = status === "current" || status === "upcoming";
  return (
    <span className={`inline-flex items-center gap-2 t-label ${live ? "text-ink" : "text-faint"}`}>
      {live ? <span className="h-2 w-2 rounded-full bg-accent ring-1 ring-ink/20" aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
