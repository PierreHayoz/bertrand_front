"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname, useSearchParams } from "next/navigation";

export default function SmoothScrollProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: { offset: -130 },
    });

    // expose global
    globalThis.__lenis = lenis;

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      // cleanup global
      if (globalThis.__lenis === lenis) globalThis.__lenis = null;
    };
  }, []);

  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    // si Lenis est stoppé (menu/modal), évite le jump
    const lenis = lenisRef.current;
    if (!lenis) return;

    requestAnimationFrame(() => {
      // certains builds exposent lenis.isStopped / lenis._isStopped selon versions
      const stopped = lenis.isStopped ?? lenis._isStopped;
      if (!stopped) {
        lenis.scrollTo(0, { immediate: true });
      }
    });
  }, [routeKey]);

  return <>{children}</>;
}
