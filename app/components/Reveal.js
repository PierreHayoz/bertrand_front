"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

export default function Reveal({ children, className = "", delay = 0, fromY = 40, duration = 1.4 }) {
  const reduce = useReducedMotion();
  const [curtainDone, setCurtainDone] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  useEffect(() => {
  if (window.__isCurtainDone) { setCurtainDone(true); return; }
  const handler = () => setCurtainDone(true);
  window.addEventListener("curtain:done", handler, { once: true });
  const fallback = setTimeout(() => setCurtainDone(true), 2000);
  return () => {
    window.removeEventListener("curtain:done", handler);
    clearTimeout(fallback);
  };
}, []);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: fromY }}
      animate={curtainDone && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: fromY }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}