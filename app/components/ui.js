import TransitionLink from "./TransitionLink";

/** En-tête de page : petit libellé + grand titre serif + chapeau (animé à la levée du rideau). */
export function PageHeader({ label, title, intro, aside }) {
  return (
    <header className="container-site pt-36 md:pt-48 pb-12 md:pb-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
      <div className="intro md:col-span-8">
        {label ? <p className="t-label text-muted">{label}</p> : null}
        <h1 className="mt-5 t-h1 text-ink text-balance">{title}</h1>
        {intro ? <p className="mt-6 t-lead text-muted max-w-[46ch]">{intro}</p> : null}
      </div>
      {aside ? <div className="intro md:col-span-4 md:text-right text-muted">{aside}</div> : null}
    </header>
  );
}

/** Titre de section avec filet. */
export function SectionHeading({ label, title, intro, children, className = "" }) {
  return (
    <div
      className={`reveal border-t border-line pt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${className}`}
    >
      <div className="max-w-2xl">
        {label ? <p className="t-label text-muted">{label}</p> : null}
        {title ? <h2 className="mt-3 t-h2 text-ink text-balance">{title}</h2> : null}
        {intro ? <p className="mt-4 text-muted">{intro}</p> : null}
      </div>
      {children}
    </div>
  );
}

/** Lien texte avec flèche (interne : transition de page ; externe : nouvel onglet). */
export function ArrowLink({ href, children, className = "" }) {
  if (!href) return null;
  const cls = `group inline-flex items-center gap-2 text-ink ${className}`;
  const content = (
    <>
      <span className="link-underline">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  );
  if (/^https?:\/\//.test(href)) {
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

/** Bandeau « Appel à l'action » (contenu Strapi). */
export function CtaBand({ cta }) {
  if (!cta?.title) return null;
  return (
    <section className="bg-accent text-accent-ink">
      <div className="container-site py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <p className="reveal md:col-span-8 t-h2 text-balance">{cta.title}</p>
        <div className="reveal md:col-span-4 md:text-right">
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

/** Citation dont les mots s'allument au fil du défilement. */
export function Quote({ quote, className = "" }) {
  if (!quote?.text) return null;
  const words = `« ${quote.text} »`.split(/\s+/);
  return (
    <figure className={`words container-site py-24 md:py-40 ${className}`} style={{ "--n": words.length }}>
      <blockquote className="font-serif italic text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.08] tracking-[-0.01em] text-ink max-w-[22ch] mx-auto text-center text-balance">
        {/* lecteurs d'écran : texte entier ; affichage : un mot par span pour l'animation */}
        <span className="sr-only">{quote.text}</span>
        <span aria-hidden="true">
          {words.map((w, i) => (
            <span key={i} className="w" style={{ "--i": i }}>
              {w}{" "}
            </span>
          ))}
        </span>
      </blockquote>
      {quote.auteur ? <figcaption className="mt-8 text-center t-label text-muted">{quote.auteur}</figcaption> : null}
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

/** « Pour aller plus loin » : deux grandes cartes de navigation. */
export function ExploreLinks({ links }) {
  return (
    <section className="container-site pb-24 md:pb-36">
      <SectionHeading label="Explorer" title="Pour aller plus loin" />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {links.map((l) => (
          <TransitionLink
            key={l.href}
            href={l.href}
            className="reveal group relative overflow-hidden border border-line p-8 md:p-10 min-h-56 flex flex-col justify-between"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
            />
            <span className="relative t-label text-muted group-hover:text-accent-ink transition-colors">{l.label}</span>
            <span className="relative mt-10 flex items-end justify-between gap-6 group-hover:text-accent-ink transition-colors">
              <span>
                <span className="block t-h3">{l.title}</span>
                {l.text ? <span className="mt-2 block text-muted group-hover:text-accent-ink/80">{l.text}</span> : null}
              </span>
              <span aria-hidden="true" className="text-2xl transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}

export const EXPLORE = {
  oeuvres: { href: "/oeuvres", label: "Catalogue", title: "Toutes les œuvres", text: "De la plus récente à la plus ancienne." },
  expositions: { href: "/expositions", label: "Agenda", title: "Les expositions", text: "En cours, à venir et passées." },
  about: { href: "/about", label: "À propos", title: "Le parcours", text: "De la typographie à la peinture." },
};
