"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCurtainDone } from "../lib/useClientState";

/**
 * Apparition douce au défilement, déclenchée une fois (après le rideau de transition).
 * Le même élément est rendu côté serveur et client (pas de décalage d'hydratation) ;
 * avec « réduire les animations », le contenu s'affiche immédiatement.
 */
export default function Reveal({ children, className = "", delay = 0, y = 24, as = "div" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const ready = useCurtainDone();
  const visible = reduce || (ready && inView);

  const MotionTag = motion[as] ?? motion.div;
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
