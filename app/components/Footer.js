import FooterNav from "./FooterNav";
import { ArrowRight } from "lucide-react";

async function getFooter() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/footer?populate=*`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("Footer fetch failed:", e.message);
    return null;
  }
}

export default async function Footer() {
  const data = await getFooter();
  const footer = data?.data;

  if (!footer) return null;

  const contact = footer.Contact;

  return (
    <footer className="bg-stone-200 md:sticky bottom-0 z-0 border-t border-stone-300/70">
      <div className="mx-auto max-w-7xl px-8 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Texte / statement */}
          <div className="md:col-span-6">
            <div className="text-xs tracking-[0.2em] uppercase text-stone-600">
              Contact
            </div>

            <div className="mt-4 text-2xl md:text-4xl font-light leading-tight text-stone-950">
              {footer.contactText}
            </div>



            <a
              href={`mailto:${contact?.Mail}`}
              className="group inline-flex mt-8"
            >
              <div
                className="
      relative
      overflow-hidden
      px-3 py-1
      text-sm
      border border-stone-600
      rounded-full
      flex items-center
      w-fit
      transition-all duration-300 ease-out
      group-hover:pr-8
    "
              >
                <span>Contactez-moi</span>

                <ArrowRight
                  size={14}
                  className="
        absolute right-3
        opacity-0
        -translate-x-1
        transition-translate duration-300 ease-out
        group-hover:opacity-100
        group-hover:translate-x-0
      "
                />
              </div>
            </a>

            <div className="mt-10 text-stone-700 text-sm leading-6">
              Basé en Suisse — réponses sous 48h en général.
            </div>
          </div>

          {/* Col 2: Coordonnées */}
          <div className="md:col-span-3 md:col-start-8">
            <div className="text-xs tracking-[0.2em] uppercase text-stone-600">
              Coordonnées
            </div>

            <div className="mt-5 space-y-4 text-stone-900">
              {contact?.Phone ? (
                <div>
                  <div className="text-stone-600 text-sm">Téléphone</div>
                  <div className="text-base">{contact.Phone}</div>
                </div>
              ) : null}

              {contact?.Mail ? (
                <div>
                  <div className="text-stone-600 text-sm">Email</div>
                  <a className="text-stone-900 hover:text-stone-950 hover:underline" href={`mailto:${contact.Mail}`}>
                    {contact.Mail}
                  </a>
                </div>
              ) : null}

              {(contact?.Address || contact?.NPA) ? (
                <div>
                  <div className="text-stone-600 text-sm">Adresse</div>
                  <div className="text-base text-stone-900">
                    {contact?.Address}
                    {contact?.NPA ? (
                      <span className="text-stone-700"> — {contact.NPA}</span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>



          {/* Col 3: Navigation */}
          <div className="md:col-span-2 md:col-start-11">
            <div className="text-xs tracking-[0.2em] uppercase text-stone-600">
              Explorer
            </div>
            <FooterNav />
          </div>

        </div>

        {/* Barre basse */}
        <div className="mt-14 pt-8 border-t border-stone-300/70 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-stone-700 text-sm">
          <div>© {new Date().getFullYear()} Bertrand Kolly</div>
          <div className="flex gap-6">
            <span className="text-stone-700 hover:text-stone-950 cursor-default">
              Website réalisé par Pierre Hayoz
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}