import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BIRTHDAY_CONFIG } from "../data/memories";
import { ChevronDown } from "lucide-react";

export const Hero: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Text carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % BIRTHDAY_CONFIG.romanticPhrases.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center text-cream-100 overflow-hidden" id="hero-section">
      
      {/* Central Birthday Announcement */}
      <div className="text-center z-10 flex flex-col items-center select-none pointer-events-none mt-12">
        <motion.span
          initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, scale: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="text-pink-300 font-sans font-bold text-xs md:text-sm uppercase mb-4 text-glow-pink"
        >
          A Cinematic Journey Made in the Stars
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl sm:text-7xl md:text-9xl font-bold tracking-tight text-cream-100 text-glow-pink leading-tight"
        >
          Happy Birthday <br />
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-gold-400 to-pink-300 bg-[length:200%_auto] animate-[pulse_6s_ease_infinite] block mt-4"
          >
            {BIRTHDAY_CONFIG.partnerName} ❤️
          </motion.span>
        </motion.h1>

        {/* Typewriter words Carousel */}
        <div className="h-16 mt-8 flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={carouselIndex}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.95 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)", scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-gold-400 font-bold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
            >
              {BIRTHDAY_CONFIG.romanticPhrases[carouselIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating text fragments in the background */}
      {["Forever", "Always", "Eternity", "Magic", "Love"].map((word, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 0.15, 0], y: -500 }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute font-signature text-6xl md:text-8xl text-pink-300 pointer-events-none select-none blur-[2px]"
          style={{
            left: `${20 + Math.random() * 60}%`,
            transform: `rotate(${Math.random() * 40 - 20}deg)`
          }}
        >
          {word}
        </motion.div>
      ))}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-12 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-pink-300">Enter The Universe</span>
        <ChevronDown className="w-5 h-5 text-pink-300 animate-bounce" />
      </motion.div>
    </div>
  );
};
