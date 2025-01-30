"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero({ header, duration, ease }) {
  return (
    <div className="HERO px-16 pt-48 pb-32 h-full grid grid-cols-3 md:grid-cols-4  bg-stone-950 md:space-y-16">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: ease, duration: 1.2, delay: duration/1000 + 0.8 }}
        className="md:leading-9 text-xl leading-6 md:text-4xl md:col-span-2 col-span-2 text-stone-200"
      >
        {header.mainTitle}
      </motion.div>
      <div className="col-span-2"></div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: ease, duration: 1.2, delay: duration/1000 + 0.8  }}
        className="md:leading-5 md:text-xl leading-5 md:col-start-3 col-start-2 col-span-3 md:col-span-1 text-stone-400 test-light"
      >
        {header.mainSubtitle}
      </motion.div>
    </div>
  );
}
