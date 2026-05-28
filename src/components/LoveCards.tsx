import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Volume2, Shield, Heart, Zap, Flame, Sparkles } from "lucide-react";
import { BIRTHDAY_CONFIG } from "../data/memories";

// Dynamic Icon mapper
const LoveIconMapper: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case "Smile":
      return <Smile className={className} />;
    case "Volume2":
      return <Volume2 className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Flame":
      return <Flame className={className} />;
    default:
      return <Heart className={className} />;
  }
};

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export const LoveCards: React.FC = () => {
  // Store clicked states for mobile tap-to-flip
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  const handleCardClick = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    // Toggle flip state
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    // Generate floating hearts at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newParticles: HeartParticle[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: clickX + (Math.random() - 0.5) * 30,
      y: clickY + (Math.random() - 0.5) * 30,
      size: Math.random() * 12 + 8,
      rotation: (Math.random() - 0.5) * 45
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Clean up particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  };

  return (
    <section className="relative py-24 px-6 md:px-12 bg-gradient-to-b from-cosmic-black via-space-purple/10 to-cosmic-black overflow-hidden" id="reasons-section">
      {/* Background ambient glowing gradient */}
      <div className="absolute top-1/3 right-1/10 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-20 select-none">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold-400 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-glow-gold"
          >
            Chapter III
          </motion.span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mt-3 text-glow-pink">
            Reasons I Love You
          </h2>
          <p className="font-sans text-xs tracking-widest text-pink-300/60 mt-3 uppercase">
            A small collection of the infinite details that make you perfect
          </p>
        </div>

        {/* Love Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BIRTHDAY_CONFIG.reasons.map((reason) => {
            const isFlipped = !!flippedCards[reason.id];
            
            return (
              <div
                key={reason.id}
                className="w-full h-80 relative perspective-1000"
                onClick={(e) => handleCardClick(reason.id, e)}
              >
                {/* 3D Flip Card Container */}
                <motion.div
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 25px 50px rgba(255,183,197,0.1)" 
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
                  className="w-full h-full relative cursor-none hover-trigger rounded-2xl transition-shadow select-none"
                >
                  
                  {/* FRONT FACE OF CARD */}
                  <div 
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0 w-full h-full rounded-2xl glass-panel border border-pink-300/20 hover:border-pink-300/40 p-8 flex flex-col justify-between items-center text-center z-10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                  >
                    {/* Glowing Accent Border */}
                    <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/50 to-transparent blur-[1px]" />
                    
                    {/* Reason Counter Badge */}
                    <span className="font-sans text-[10px] tracking-[0.25em] text-pink-300 font-bold uppercase">
                      Reason #{reason.id}
                    </span>

                    {/* Central Icon */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500/10 border border-pink-400/20 text-gold-400 shadow-[0_0_20px_rgba(255,215,0,0.15)] group-hover:scale-110 transition-transform">
                      <LoveIconMapper name={reason.iconName} className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <div className="mb-2">
                      <h3 className="font-serif text-2xl font-semibold text-cream-100 tracking-wide text-glow-pink">
                        {reason.title}
                      </h3>
                      <p className="font-sans text-[9px] uppercase tracking-widest text-gold-500 mt-1 font-bold">
                        Click to Reveal ✨
                      </p>
                    </div>
                  </div>

                  {/* BACK FACE OF CARD */}
                  <div 
                    style={{ 
                      backfaceVisibility: "hidden", 
                      transform: "rotateY(180deg)" 
                    }}
                    className="absolute inset-0 w-full h-full rounded-2xl bg-cream-100 text-space-purple p-8 flex flex-col justify-between items-center text-center shadow-[0_10px_40px_rgba(255,183,197,0.2)] border border-pink-300"
                  >
                    {/* Top vintage stamp */}
                    <span className="font-sans text-[10px] tracking-[0.2em] text-pink-400 font-bold uppercase">
                      From my heart to yours
                    </span>

                    {/* Handwriting Description */}
                    <p className="font-handwritten text-xl sm:text-2xl font-bold leading-relaxed text-space-purple flex-1 flex items-center justify-center px-2">
                      "{reason.description}"
                    </p>

                    {/* Bottom Close Indicator */}
                    <div className="flex items-center gap-1 mt-2 text-pink-400 font-bold font-sans text-[9px] uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      <span>Tap to Flip back</span>
                      <Sparkles className="w-3 h-3 text-gold-500" />
                    </div>
                  </div>

                </motion.div>

                {/* Floating Heart Particles (Rendered when clicked) */}
                <AnimatePresence>
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ 
                        opacity: 0.8, 
                        scale: 0.2, 
                        x: p.x, 
                        y: p.y, 
                        rotate: p.rotation 
                      }}
                      animate={{ 
                        opacity: 0, 
                        y: p.y - 120, 
                        scale: 1.5,
                        rotate: p.rotation + 45
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute pointer-events-none text-red-400 z-50 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
