import { ArrowLink } from "./components/ui";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <main className="container-site min-h-[70vh] pt-36 md:pt-48 pb-24">
      <p className="t-label text-muted">Erreur 404</p>
      <h1 className="mt-5 t-h1 text-ink">Cette page n’existe pas.</h1>
      <p className="mt-6 t-lead text-muted max-w-[40ch]">Elle a peut-être été déplacée. Les toiles, elles, sont toujours là.</p>
      <div className="mt-10 flex flex-wrap gap-8">
        <ArrowLink href="/">Accueil</ArrowLink>
        <ArrowLink href="/oeuvres">Les œuvres</ArrowLink>
      </div>
    </main>
  );
}
