"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = useMemo(
    () => [
      { href: "/", label: "Accueil" },
      { href: "/oeuvres", label: "Œuvres" },
      { href: "/about", label: "À propos" },
      { href: "/expositions", label: "Expositions" },
    ],
    []
  );

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };
useEffect(() => {
  setOpen(false);
}, [pathname]);

  useEffect(() => {
  const lenis = globalThis.__lenis;

  if (open) {
    lenis?.stop?.();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  } else {
    lenis?.start?.();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  return () => {
    lenis?.start?.();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };
}, [open]);


  return (
    <header className="fixed top-0 z-[100] w-full bg-stone-950/80 backdrop-blur border-b border-stone-900/70">
      <div className="mx-auto max-w-7xl px-8 md:px-16 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="leading-none">
            <span className="text-lg  text-stone-200">
              Bertrand Kolly
            </span>

          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative"
              >
                <span
                  className={` border border-1 border-stone-800 relative block px-3 py-1 text-stone-200 text-sm tracking-wide transition-colors overflow-hidden rounded-full`}
                >
                  {item.label}
                  <div className={`w-full h-full group-hover:left-0 top-0 duration-300 ${active ? "left-0" : "-left-full"} absolute bg-stone-200 mix-blend-difference`}></div>
                </span>

              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden inline-flex relative z-[1000] items-center gap-2 rounded-full border border-stone-800 px-4 py-2 text-stone-200"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-stone-400">
            Menu
          </span>
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <>

          <div className="md:hidden fixed inset-0 z-[120] bg-stone-950 h-[100dvh]">
            <div className="flex h-full min-h-0 flex-col">
              {/* nav scrollable */}
              <nav className="flex-1 min-h-0 overflow-y-auto px-8 pt-24 pb-8">
                {nav.map((navItem) => {
                  const active = isActive(navItem.href);
                  return (
                    <motion.div key={navItem.href}>
                      <Link
                        href={navItem.href}
                        prefetch
                        className="block py-4"
                      >
                        <div className="flex items-baseline justify-between gap-6">
                          <span
                            className={`text-3xl font-light tracking-tight ${active ? "text-stone-100" : "text-stone-200"
                              }`}
                          >
                            {navItem.label}
                          </span>

                          <span
                            className={`text-xs tracking-[0.2em] uppercase ${active ? "text-stone-400" : "text-stone-600"
                              }`}
                          >
                            {active ? "actif" : "ouvrir"}
                          </span>
                        </div>

                        <div className="mt-4 h-px bg-stone-900/70" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* footer fixed */}
              <div className="shrink-0 px-8 pb-10 pt-6 border-t border-stone-900/70">
                <div className="text-xs tracking-[0.2em] uppercase text-stone-500">
                  Contact
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-stone-300">
                  <a className="text-sm hover:text-stone-100 transition-colors" href="mailto:hello@exemple.com">
                    hello@exemple.com
                  </a>
                  <a className="text-sm hover:text-stone-100 transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                  <div className="text-sm text-stone-500">
                    © {new Date().getFullYear()} Bertrand Kolly
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}


    </header>
  );
}
