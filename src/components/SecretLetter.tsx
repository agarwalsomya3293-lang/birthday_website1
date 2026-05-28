import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, X } from "lucide-react";
import { BIRTHDAY_CONFIG } from "../data/memories";

export const SecretLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Framer Motion animation configurations
  const envelopeVariants = {
    closed: { scale: 1, rotate: 0 },
    open: { scale: 0.9, y: 120, rotate: -2, opacity: 0.5 }
  };

  const letterVariants = {
    closed: { y: 0, scale: 0.4, opacity: 0, zIndex: 5 },
    open: { 
      y: -220, 
      scale: 1, 
      opacity: 1, 
      zIndex: 40,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 18,
        delay: 0.8 // Wait for envelope flap to open
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5 + i * 0.8, // Stagger paragraph text fade-in
        duration: 1.2,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section 
      className="relative py-32 px-6 md:px-12 bg-cosmic-black flex flex-col justify-center items-center overflow-hidden" 
      id="letter-section"
    >
      {/* Immersive backdrop blurry spheres */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-700/5 blur-[140px] pointer-events-none" />

      {/* Background stars floating */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-space-purple/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 select-none">
        
        {/* Section Header */}
        <div className="text-center mb-16 select-none">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold-400 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-glow-gold"
          >
            Chapter IV
          </motion.span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mt-3 text-glow-pink">
            The Sealed Letter
          </h2>
          <p className="font-sans text-xs tracking-widest text-pink-300/60 mt-3 uppercase">
            A small secret kept only for your eyes
          </p>
        </div>

        {/* Envelope Container Wrapper */}
        <div className="h-[450px] flex items-center justify-center relative w-full max-w-lg">
          
          <AnimatePresence>
            {/* ENVELOPE SHAPE */}
            {!isOpen && (
              <motion.div
                variants={envelopeVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                className="relative w-80 sm:w-96 h-56 bg-cream-100 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-none hover-trigger flex items-center justify-center group border border-pink-300/20"
              >
                {/* Triangular top flap fold line */}
                <div className="absolute top-0 inset-x-0 h-0 border-t-[110px] border-t-cream-100/90 border-x-[160px] sm:border-x-[192px] border-x-transparent z-20 origin-top transition-transform duration-700 group-hover:skew-x-1" />
                
                {/* Lower overlapping side panels */}
                <div className="absolute bottom-0 inset-x-0 h-0 border-b-[120px] border-b-cream-100/95 border-x-[160px] sm:border-x-[192px] border-x-transparent z-10" />

                {/* Gilded Wax Seal Stamp */}
                <div className="absolute z-30 flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 via-red-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-pink-400/40 relative"
                  >
                    {/* Inner seal pattern */}
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-cream-100" />
                    </div>
                  </motion.div>
                  <span className="font-sans text-[9px] font-bold text-space-purple/60 uppercase tracking-[0.2em] mt-3">
                    Click to Open
                  </span>
                </div>

                {/* Soft glow borders on hover */}
                <div className="absolute inset-0 border border-gold-400/10 group-hover:border-pink-300/40 rounded-lg transition-colors duration-500 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* THE HIDDEN LETTER SLIDING OUT */}
          <motion.div
            variants={letterVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[500px] h-[550px] bg-cream-100 border-2 border-pink-300 rounded-xl p-8 sm:p-12 text-space-purple shadow-[0_25px_60px_rgba(255,183,197,0.25)] flex flex-col justify-between overflow-y-auto no-scrollbar pointer-events-auto select-none ${
              isOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* Elegant luxury headers */}
            <div className="flex justify-between items-start border-b border-pink-300/30 pb-4">
              <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-pink-400">
                Universe Private Archives
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-pink-300/20 text-space-purple/80 hover:text-space-purple transition-colors cursor-none hover-trigger"
                title="Seal letter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cursive text fields */}
            <div className="flex-1 mt-6 space-y-5 text-left font-handwritten text-xl sm:text-2xl font-bold leading-relaxed text-space-purple">
              {/* Salutation */}
              <motion.p
                custom={0}
                variants={lineVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                className="font-serif italic font-semibold text-lg text-space-purple mb-4"
              >
                {BIRTHDAY_CONFIG.secretLetter.salutation}
              </motion.p>

              {/* Main Content Paragraphs */}
              {BIRTHDAY_CONFIG.secretLetter.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  custom={index + 1}
                  variants={lineVariants}
                  initial="hidden"
                  animate={isOpen ? "visible" : "hidden"}
                >
                  {paragraph}
                </motion.p>
              ))}

              {/* Closing */}
              <div className="pt-4 border-t border-pink-300/20">
                <motion.p
                  custom={BIRTHDAY_CONFIG.secretLetter.paragraphs.length + 1}
                  variants={lineVariants}
                  initial="hidden"
                  animate={isOpen ? "visible" : "hidden"}
                  className="font-serif italic text-base text-pink-400/90"
                >
                  {BIRTHDAY_CONFIG.secretLetter.closing}
                </motion.p>
                <motion.p
                  custom={BIRTHDAY_CONFIG.secretLetter.paragraphs.length + 2}
                  variants={lineVariants}
                  initial="hidden"
                  animate={isOpen ? "visible" : "hidden"}
                  className="font-signature text-3xl sm:text-4xl text-space-purple font-bold tracking-wide mt-1 block"
                >
                  {BIRTHDAY_CONFIG.secretLetter.signature}
                </motion.p>
              </div>
            </div>

            {/* Sparkles details footer */}
            <div className="flex items-center justify-center gap-1.5 text-pink-400/70 font-sans text-[8px] uppercase tracking-widest mt-6">
              <Sparkles className="w-3 h-3 text-gold-500" />
              <span>Only for your gorgeous eyes</span>
              <Sparkles className="w-3 h-3 text-gold-500" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
