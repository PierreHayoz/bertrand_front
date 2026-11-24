import Link from "next/link";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/oeuvres", label: "Œuvres" },
  { href: "/expositions", label: "Expositions" },
  { href: "/about", label: "À propos" },
];

export default function Footer({ contact }) {
  return (
    <footer className="relative md:sticky bottom-0 z-0 bg-inverse text-inverse-ink">
      <div className="container-site pt-20 md:pt-28 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <p className="t-label text-inverse-muted">Contact</p>
            <p className="mt-6 t-h2 max-w-[18ch]">
              {contact?.texte ?? "Envie de découvrir mon univers en atelier ?"}
            </p>
            {contact?.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-accent text-accent-ink px-6 py-3 text-[0.95rem] transition-transform duration-300 hover:-translate-y-0.5"
              >
                M’écrire
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
            {contact?.vente ? (
              <div className="mt-12">
                <p className="t-label text-inverse-muted">Vente</p>
                <p className="mt-3 text-inverse-ink">{contact.vente.texte}</p>
                <a
                  href={contact.vente.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-3 rounded-full border border-inverse-ink/40 px-6 py-3 text-[0.95rem] transition-colors duration-300 hover:bg-inverse-ink hover:text-inverse"
                >
                  {contact.vente.label}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-3 md:col-start-8 space-y-6 text-[0.95rem]">
            {contact?.telephone ? (
              <div>
                <p className="t-label text-inverse-muted">Téléphone</p>
                <a className="mt-2 block hover:underline" href={`tel:${contact.telephone.replace(/\s/g, "")}`}>
                  {contact.telephone}
                </a>
              </div>
            ) : null}
            {contact?.email ? (
              <div>
                <p className="t-label text-inverse-muted">E-mail</p>
                <a className="mt-2 block hover:underline break-all" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
            ) : null}
            {contact?.adresse || contact?.npaLocalite ? (
              <div>
                <p className="t-label text-inverse-muted">Atelier</p>
                <p className="mt-2">
                  {contact?.adresse}
                  {contact?.npaLocalite ? <br /> : null}
                  {contact?.npaLocalite}
                </p>
              </div>
            ) : null}
          </div>

          <nav className="md:col-span-2 md:col-start-11 md:items-end flex md:flex-col gap-x-6 gap-y-2 flex-wrap text-[0.95rem]" aria-label="Pied de page">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-inverse-muted hover:text-inverse-ink transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-20 md:mt-28 pt-6 border-t border-inverse-line flex flex-col md:flex-row gap-2 md:items-end md:justify-between">
          <p className="font-serif text-[clamp(3rem,11vw,10rem)] leading-[0.85] tracking-[-0.02em]">
            Bertrand Kolly
          </p>
          <div className="text-sm text-inverse-muted md:text-right md:pb-3">
            <p>© {new Date().getFullYear()} Bertrand Kolly, artiste peintre</p>
            <p>Site réalisé par Pierre Hayoz</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
