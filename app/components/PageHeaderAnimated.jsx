"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageHeaderAnimated({
  eyebrow,
  title,
  description,
}) {
  const reduce = useReducedMotion();
const [active, setActive] = useState(false);

  useEffect(() => {
  if (window.__isCurtainDone) { setActive(true); return; }
  const handler = () => setActive(true);
  window.addEventListener("curtain:done", handler, { once: true });
  const fallback = setTimeout(() => setActive(true), 2000);
  return () => {
    window.removeEventListener("curtain:done", handler);
    clearTimeout(fallback);
  };
}, []);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.header
      variants={container}
      initial={reduce ? "show" : "hidden"}
      animate={active ? "show" : "hidden"}
      className="max-w-2xl"
    >
      <motion.div
        variants={item}
        className="text-xs tracking-[0.2em] uppercase text-stone-500"
      >
        {eyebrow}
      </motion.div>

      <motion.h1
        variants={item}
        className="mt-4 text-3xl md:text-5xl font-light leading-[1.05] text-stone-200"
      >
        {title}
      </motion.h1>

      {description && (
        <motion.p
          variants={item}
          className="mt-5 text-stone-400 leading-6"
        >
          {description}
        </motion.p>
      )}
    </motion.header>
  );
}