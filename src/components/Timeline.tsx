import React from "react";
import { motion } from "framer-motion";

export const Timeline: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center pointer-events-none" id="timeline-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center z-10 select-none"
      >
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-purple-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]">
          Chapter 2
        </span>
        <h2 className="font-serif text-5xl md:text-7xl font-bold mt-3 text-cream-100 glow-purple">
          Our Universe
        </h2>
      </motion.div>
    </div>
  );
};
