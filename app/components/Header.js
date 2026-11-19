"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TransitionLink from "./TransitionLink";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/oeuvres", label: "Œuvres" },
  { href: "/expositions", label: "Expositions" },
  { href: "/about", label: "À propos" },
];

export default function Header({ contact }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Ferme le menu quand la page change
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  const isActive = (href) => pathname?.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const lenis = globalThis.__lenis;
    lenis?.stop?.();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start?.();
    };
  }, [open]);

  return (
    <header className={`site-header fixed top-0 z-100 w-full border-b ${open ? "bg-bg!" : ""}`}>
      <div className="container-site h-16 md:h-20 flex items-center justify-between gap-6">
        <TransitionLink href="/" className="font-serif text-2xl md:text-[1.75rem] leading-none text-ink">
          Bertrand Kolly
        </TransitionLink>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {NAV.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`link-underline text-[0.95rem] transition-colors ${
                isActive(item.href) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </TransitionLink>
          ))}
          <span className="h-4 w-px bg-line" aria-hidden="true" />
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="md:hidden relative z-130 t-label text-ink py-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open ? (
        <div id="menu-mobile" className="md:hidden fixed inset-0 z-120 bg-bg h-dvh flex flex-col">
          <nav className="flex-1 overflow-y-auto container-site pt-28 pb-8" aria-label="Navigation mobile">
            {[{ href: "/", label: "Accueil" }, ...NAV].map((item) => {
              const active = item.href === "/" ? pathname === "/" : isActive(item.href);
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-baseline justify-between border-b border-line py-5"
                >
                  <span className={`t-h2 ${active ? "text-ink" : "text-muted"}`}>{item.label}</span>
                  {active ? <span className="t-label text-faint">Ici</span> : null}
                </TransitionLink>
              );
            })}
          </nav>

          <div className="container-site shrink-0 pb-10 pt-6 border-t border-line flex items-end justify-between gap-6">
            <div className="space-y-1 text-sm text-muted">
              {contact?.email ? (
                <a className="block hover:text-ink" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : null}
              {contact?.telephone ? (
                <a className="block hover:text-ink" href={`tel:${contact.telephone.replace(/\s/g, "")}`}>
                  {contact.telephone}
                </a>
              ) : null}
            </div>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
