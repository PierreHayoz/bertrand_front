"use client";

/*
 * Verrouillage du défilement partagé (visionneuse, menu mobile).
 * Arrête aussi l'inertie de Lenis immédiatement : la page ne bouge plus
 * pendant qu'une transition photographie la position des éléments.
 * Compteur : plusieurs verrous peuvent coexister sans se libérer l'un l'autre.
 */
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  const lenis = globalThis.__lenis;
  if (lenis) {
    lenis.stop(); // stoppe net l'inertie en cours
  }
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks > 0) return;
  document.documentElement.style.overflow = "";
  globalThis.__lenis?.start();
}
