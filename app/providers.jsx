"use client";

import React from "react";
import { TransitionRouter } from "next-transition-router";

export function Providers({ children }) {
  return (
    <TransitionRouter
      auto
      leave={async (next) => {
        document.documentElement.classList.add("is-leaving");
        // laisse le temps à l’animation CSS de jouer
        await new Promise((r) => setTimeout(r, 350));
        next();
      }}
      enter={async (next) => {
        document.documentElement.classList.remove("is-leaving");
        // optionnel : attendre un tick
        await new Promise((r) => setTimeout(r, 10));
        next();
      }}
    >
      {/* overlay global */}
      <div className="page-transition-overlay" aria-hidden="true" />
      {children}
    </TransitionRouter>
  );
}

