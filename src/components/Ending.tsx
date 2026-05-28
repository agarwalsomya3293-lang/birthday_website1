import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { BIRTHDAY_CONFIG } from "../data/memories";

export const Ending: React.FC = () => {
  // Use a subset of photos to float around as fading memory fragments
  const floatingMemories = [
    { id: 1, url: BIRTHDAY_CONFIG.memoriesPhotos[2].url, top: "15%", left: "12%", delay: 0.5, rotate: -12, scale: 0.7 },
    { id: 2, url: BIRTHDAY_CONFIG.memoriesPhotos[3].url, top: "60%", left: "8%", delay: 2.5, rotate: 15, scale: 0.65 },
    { id: 3, url: BIRTHDAY_CONFIG.memoriesPhotos[4].url, top: "20%", right: "12%", delay: 1.5, rotate: 10, scale: 0.75 },
    { id: 4, url: BIRTHDAY_CONFIG.memoriesPhotos[5].url, top: "65%", right: "10%", delay: 3.5, rotate: -8, scale: 0.6 }
  ];

  return (
    <section 
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-6 bg-cosmic-black text-cream-100 overflow-hidden" 
      id="ending-section"
    >
      {/* Absolute dark infinity backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black via-black to-cosmic-black pointer-events-none" />

      {/* Flashing star particles in backdrop */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-35 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />

      {/* Floating memories drifting upwards in the distance */}
      <div className="absolute inset-0 w-full h-full pointer-events-none hidden md:block overflow-hidden">
        {floatingMemories.map((mem) => (
          <motion.div
            key={mem.id}
            initial={{ y: 200, opacity: 0, rotate: mem.rotate }}
            whileInView={{ 
              y: -300, 
              opacity: [0, 0.4, 0.4, 0],
              rotate: mem.rotate * 1.5
            }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
              delay: mem.delay
            }}
            style={{ 
              position: "absolute",
              top: mem.top,
              ...(mem.left ? { left: mem.left } : { right: mem.right }),
              width: "150px"
            }}
            className="polaroid-frame bg-cream-100/90 grayscale contrast-[110%] border border-white/5 opacity-30 shadow-md scale-75"
          >
            <div className="polaroid-img-container">
              <img src={mem.url} alt="Drifting memory fragment" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central Ending Declaration Container */}
      <div className="relative z-10 max-w-2xl text-center select-none flex flex-col items-center">
        
        {/* Heart beat emblem */}
        <motion.div
          animate={{ 
            scale: [1, 1.12, 1, 1.18, 1],
            boxShadow: [
              "0 0 20px rgba(255, 183, 197, 0.1)",
              "0 0 35px rgba(255, 183, 197, 0.3)",
              "0 0 20px rgba(255, 183, 197, 0.1)",
              "0 0 45px rgba(255, 183, 197, 0.45)",
              "0 0 20px rgba(255, 183, 197, 0.1)"
            ]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full bg-pink-500/10 border border-pink-300/30 text-pink-300 flex items-center justify-center mb-10"
        >
          <Heart className="w-6 h-6 fill-pink-300" />
        </motion.div>

        {/* Ending statement */}
        <motion.h2 
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-cream-100 leading-tight tracking-wide text-glow-pink select-none px-4"
        >
          In every universe,<br />
          it will always be you.
        </motion.h2>

        {/* Vintage closing signature */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1.2 }}
          className="font-signature text-3xl sm:text-4xl text-gold-400 mt-8 tracking-wider text-glow-gold"
        >
          Yours Forever & Always ❤️
        </motion.p>

        {/* Sparkling stars footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 2 }}
          className="flex items-center gap-1.5 text-pink-300/50 font-sans text-[8px] uppercase tracking-[0.4em] mt-16"
        >
          <Sparkles className="w-3 h-3 text-gold-500" />
          <span>Fading into stardust</span>
          <Sparkles className="w-3 h-3 text-gold-500" />
        </motion.div>

      </div>
    </section>
  );
};
