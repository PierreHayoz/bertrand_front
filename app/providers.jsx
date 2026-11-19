"use client";
import React, { useRef, useState, useEffect, startTransition } from "react";
import { gsap } from "gsap";
import { TransitionRouter, useTransitionState } from "next-transition-router";

const LABELS = {
  "/": { label: "Bertrand Kolly", subtitle: "Artiste peintre" },
  "/oeuvres": { label: "Œuvres" },
  "/about": { label: "À propos" },
  "/expositions": { label: "Expositions" },
};

function CurtainController({ curtainRef, labelRef, subtitleRef }) {
  const { isReady } = useTransitionState();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!isReady) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      const pathname = window.location.pathname;
      const entry = LABELS[pathname];
      const pageTitle = entry?.label ?? document.title.split("|")[0].trim();
      const pageSub = entry?.subtitle ?? null;

      gsap.set(curtainRef.current, { y: "0%" });

      if (labelRef.current) labelRef.current.textContent = pageTitle;
      if (subtitleRef.current) subtitleRef.current.textContent = pageSub ?? "";

      gsap.to([labelRef.current, pageSub ? subtitleRef.current : null].filter(Boolean), {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to([labelRef.current, subtitleRef.current], {
        opacity: 0,
        y: 12,
        duration: 0.25,
        delay: 0.6, // ← laisse le texte visible
        ease: "power2.in",
        onComplete: () => {
          gsap.to(curtainRef.current, {
            y: "100%",
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
              window.__isCurtainDone = true;
              window.dispatchEvent(new Event("curtain:done"));
            },
          });
        }
      });
      gsap.to(curtainRef.current, {
        y: "-100%",
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.8,
        onComplete: () => {
          gsap.set(curtainRef.current, { y: "100%" });
          gsap.set([labelRef.current, subtitleRef.current], { opacity: 0, y: 12 });
          if (labelRef.current) labelRef.current.textContent = "";
          if (subtitleRef.current) subtitleRef.current.textContent = "";
          window.__isCurtainDone = true;
          window.dispatchEvent(new Event("curtain:done"));
        },
      });
      return;
    }

    const targets = [labelRef.current, subtitleRef.current].filter(Boolean);
    const tl = gsap.timeline()
      .to(targets, { opacity: 0, y: 12, duration: 0.2, ease: "power2.in" })
      .to(curtainRef.current, {
        y: "100%",
        duration: 0.8,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(curtainRef.current, { y: "-100%" });
          gsap.set(targets, { opacity: 0, y: 12 });
          window.__isCurtainDone = true;
          window.dispatchEvent(new Event("curtain:done"));
        },
      });

    return () => tl.kill();
  }, [isReady]);

  return null;
}

export { LABELS };

export function Providers({ children }) {
  const curtainRef = useRef(null);
  const labelRef = useRef(null);
  const subtitleRef = useRef(null);

  const curtainSubtitleRef = useRef(null); // valeur live, pas le state

  if (typeof window !== "undefined") {
    window.__setCurtainLabel = (text) => {
      if (labelRef.current) labelRef.current.textContent = text;
    };
    window.__setCurtainSubtitle = (sub) => {
      curtainSubtitleRef.current = sub;
      if (subtitleRef.current) subtitleRef.current.textContent = sub ?? "";
    };
  }

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        window.__isCurtainDone = false;
        const tl = gsap.timeline({ onComplete: next })
          .fromTo(curtainRef.current,
            { y: "-100%" },
            { y: "0%", duration: 0.8, ease: "power4.inOut" }
          )
          .to(labelRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            onStart: () => {
              // Lu ici, après que TransitionLink a eu le temps de setter
              if (curtainSubtitleRef.current) {
                gsap.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
              }
            },
          });
        return () => tl.kill();
      }}
      enter={(next) => {
        requestAnimationFrame(() => startTransition(next));
      }}
    >
      <CurtainController
        curtainRef={curtainRef}
        labelRef={labelRef}
        subtitleRef={subtitleRef}
      />

      <div
        ref={curtainRef}
        aria-hidden="true"
        className="px-8 text-center"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9000,
          pointerEvents: "none",
          background: "var(--inverse-bg)",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          
          transform: "translateY(0%)",
        }}
      >
        <span
          ref={labelRef}
          className="t-h1"
          style={{
            color: "var(--inverse-ink)",
            opacity: 0,
            transform: "translateY(12px)",
          }}
        />
        <span
          ref={subtitleRef}
          style={{
            fontSize: "12px",
            color: "var(--inverse-muted)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0,
            transform: "translateY(12px)",
          }}
        />
      </div>

      {children}
    </TransitionRouter>
  );
}