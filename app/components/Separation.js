"use client";
import { motion, useInView } from "framer-motion";

export default function Separation({ separation }) {


  return (
    <motion.div
      
      className="md:col-start-2 col-span-4 md:col-span-2 pb-32 text-stone-200 text-xl md:text-4xl  md:leading-9 "
    >
      {separation.Text}
    </motion.div>
  );
}
