import { motion } from "framer-motion"
export default function Intro() {
  return (
    <motion.div
    initial={{y:0}}
    animate={{y:'-100%'}}
    transition={{duration:1}}
    className="h-screen w-screen fixed bg-white top-0 left-0 z-50 flex items-center justify-center">
        <h1 className="text-5xl">Bertrand Kolly</h1>
    </motion.div>
  )
}
