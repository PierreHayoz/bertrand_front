"use client";

import { useSyncExternalStore } from "react";

/* Thème courant (attribut data-theme de <html>) */
function subscribeTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
export function useTheme() {
  return useSyncExternalStore(
    subscribeTheme,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => null
  );
}

/* Fin du rideau de transition (événement « curtain:done », avec filet de sécurité) */
function subscribeCurtain(callback) {
  window.addEventListener("curtain:done", callback);
  const fallback = setTimeout(() => {
    if (!window.__isCurtainDone) {
      window.__isCurtainDone = true;
      window.dispatchEvent(new Event("curtain:done"));
    }
  }, 1800);
  return () => {
    window.removeEventListener("curtain:done", callback);
    clearTimeout(fallback);
  };
}
export function useCurtainDone() {
  return useSyncExternalStore(subscribeCurtain, () => Boolean(window.__isCurtainDone), () => false);
}

/* Page défilée au-delà d'un seuil */
function subscribeScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
export function useScrolledPast(threshold = 24) {
  return useSyncExternalStore(subscribeScroll, () => window.scrollY > threshold, () => false);
}
