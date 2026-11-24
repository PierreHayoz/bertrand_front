"use client";

import { useTheme } from "../lib/useClientState";

/** Bascule entre « Galerie claire » et « Noir affiné » ; le choix est mémorisé. */
export default function ThemeToggle({ className = "" }) {
  const theme = useTheme();

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors ${className}`}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      title={isDark ? "Thème clair" : "Thème sombre"}
    >
      <span
        aria-hidden="true"
        className="relative h-4 w-4 rounded-full border border-current overflow-hidden"
      >
        <span
          className={`absolute inset-y-0 left-0 w-1/2 bg-current transition-transform duration-500 ease-out-expo ${
            isDark ? "translate-x-full" : "translate-x-0"
          }`}
        />
      </span>
      <span className="t-label">{isDark ? "Clair" : "Sombre"}</span>
    </button>
  );
}
