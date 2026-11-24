"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/*
 * Clé de la page courante (chemin + paramètres, ex. « /oeuvres?page=2 »), pour relancer
 * animations, défilement et visionneuse à chaque changement de page.
 *
 * useSearchParams oblige Next à abandonner le rendu serveur de tout ce qu'il englobe
 * jusqu'au <Suspense> le plus proche. Il est donc isolé ici, dans un composant invisible
 * (<RouteSearch />, à placer une fois dans le layout) qui publie les paramètres dans un
 * petit magasin : le contenu des pages garde son HTML complet.
 */
let search = "";
const listeners = new Set();

function SearchWatcher() {
  const value = useSearchParams().toString();
  useEffect(() => {
    if (value === search) return;
    search = value;
    listeners.forEach((notify) => notify());
  }, [value]);
  return null;
}

export function RouteSearch() {
  return (
    <Suspense fallback={null}>
      <SearchWatcher />
    </Suspense>
  );
}

const subscribe = (notify) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

export function useRouteKey() {
  const pathname = usePathname();
  const params = useSyncExternalStore(subscribe, () => search, () => "");
  return `${pathname}?${params}`;
}
