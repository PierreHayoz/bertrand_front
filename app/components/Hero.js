"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTransitionState } from "next-transition-router";
import { useEffect, useState } from "react";
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};
export default function HeroMainClient({
  title,
  subtitle,
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.__isCurtainDone) { setActive(true); return; }
    const handler = () => setActive(true);
    window.addEventListener("curtain:done", handler, { once: true });
    return () => window.removeEventListener("curtain:done", handler);
  }, []);
  return (
    <motion.div
      variants={container}
      initial={reduce ? "show" : "hidden"}
      animate={active ? "show" : "hidden"}
      className="grid grid-cols-3 md:grid-cols-12 gap-y-10 md:gap-y-0"
    >
      <div className="col-span-3 md:col-span-7">
        <motion.div
          variants={item}
          className="text-xs  uppercase text-stone-500"
        >
          Collection — Accrochage
        </motion.div>

        <motion.div
          variants={item}
          className="mt-5 text-3xl md:text-5xl md:leading-[60px] text-stone-200  font-light"
        >
          {title}
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 border-t border-stone-900/80 pt-6 flex gap-6 text-stone-500 text-sm"
        >
          <div className="min-w-28">
            <div className="text-stone-400">Période</div>
            <div>2019–2026</div>
          </div>
          <div className="min-w-28">
            <div className="text-stone-400">Médiums</div>
            <div>mix</div>
          </div>
          <div className="hidden md:block">
            <div className="text-stone-400">Rythme</div>
            <div>sélection curatée</div>
          </div>
        </motion.div>
      </div>

      <div className="col-span-3 md:col-span-4 md:col-start-9">
        <motion.p variants={item} className="text-stone-400 leading-6">
          {subtitle}
        </motion.p>

        <motion.div variants={item} className="mt-8 text-stone-500 text-sm">
          Faites défiler — cliquez sur une œuvre pour ouvrir le détail.
        </motion.div>
      </div>
    </motion.div>
  );
}
