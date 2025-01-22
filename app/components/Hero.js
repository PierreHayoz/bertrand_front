"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero({ header }) {
  console.log(header)
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 pt-32 z-10 md:py-32 px-4 md:px-16 bg-stone-950 md:space-y-16 relative">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.8 }}
        className="md:leading-9 text-xl leading-6 md:text-4xl md:col-span-2 col-span-2 text-stone-200"
      >
        {header.mainTitle}
      </motion.div>
      <div className="col-span-2"></div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.8 }}
        className="md:leading-5 md:text-xl leading-5 md:col-start-3 col-start-2 col-span-3 md:col-span-1 text-stone-400 test-light"
      >
        {header.mainSubtitle}
      </motion.div>
    </div>
  );
}
