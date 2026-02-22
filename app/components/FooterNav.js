"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function FooterNav() {
  const pathname = usePathname();

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

  return (
    <nav className="mt-5 flex md:flex-col gap-3">
      {nav.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group relative w-fit"
          >
            <span
              className={`relative block px-3 py-1 border border-stone-300 text-stone-950 text-sm tracking-wide transition-colors rounded-full overflow-hidden`}
            >
              {item.label}
              {/* même “wipe” que ton header */}
              <span
                className={`w-full h-full top-0 duration-300 ${active ? "left-0" : "-left-full"
                  } group-hover:left-0 absolute bg-stone-200 mix-blend-difference`}
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
