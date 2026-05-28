import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sparkles, MessageCircle, Coffee, Camera, Heart, Activity } from "lucide-react";
import { BIRTHDAY_CONFIG } from "../data/memories";

// Dynamic Lucide Icon Mapper
const IconMapper: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case "Sparkles":
      return <Sparkles className={className} />;
    case "MessageCircle":
      return <MessageCircle className={className} />;
    case "Coffee":
      return <Coffee className={className} />;
    case "Camera":
      return <Camera className={className} />;
    case "Heart":
      return <Heart className={className} />;
    default:
      return <Activity className={className} />;
  }
};

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track scroll position inside this timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Soft elastic spring for drawing the connecting line butter-smoothly
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <section 
      ref={containerRef}
      className="relative py-24 px-6 md:px-12 bg-cosmic-black text-cream-100 overflow-hidden" 
      id="timeline-section"
    >
      {/* Decorative neon blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        
        {/* Header Title */}
        <div className="text-center mb-20 select-none">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-pink-300 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-glow-pink"
          >
            Chapter II
          </motion.span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mt-3 text-glow-pink">
            Our Love Story Constellation
          </h2>
          <p className="font-sans text-xs tracking-widest text-pink-300/60 mt-3 uppercase">
            Tracing the path that brought us together
          </p>
        </div>

        {/* The SVG Connecting Constellation Line (Desktop / Tablet) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-40 bottom-12 w-1 hidden md:block">
          {/* Static Background Path */}
          <div className="absolute inset-0 bg-white/10 w-[2px] left-[1px] rounded-full" />
          
          {/* Animated Neon Drawing Path */}
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-pink-300 via-gold-400 to-pink-300 w-1 shadow-[0_0_15px_rgba(255,215,0,0.5)] rounded-full origin-top"
          />
        </div>

        {/* The Timeline Items */}
        <div className="space-y-12 md:space-y-24 relative">
          {BIRTHDAY_CONFIG.timelineEvents.map((event, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div 
                key={event.id} 
                className={`flex flex-col md:flex-row items-center w-full justify-between relative ${
                  isLeft ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* 1. Center Glowing Node (Desktop / Tablet) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border border-pink-300/30 glass-panel-heavy hidden md:flex items-center justify-center z-20 shadow-[0_0_10px_rgba(255,183,197,0.2)]">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    whileInView={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                    className="w-3.5 h-3.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(255,215,0,0.8)]" 
                  />
                </div>

                {/* 2. Floating Content Card */}
                <motion.div
                  initial={{ 
                    opacity: 0, 
                    x: isLeft ? -80 : 80, 
                    y: 20 
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    x: 0, 
                    y: 0 
                  }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 45, 
                    damping: 12 
                  }}
                  className={`w-full md:w-[44%] relative z-10`}
                >
                  <motion.div
                    whileHover={{ 
                      y: -6, 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                    }}
                    className={`glass-panel-heavy p-6 md:p-8 rounded-2xl border transition-all duration-300 select-none hover-trigger ${event.glowColor}`}
                  >
                    {/* Header: Date + Icon */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-pink-300 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-400/20">
                        {event.date}
                      </span>
                      <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold-400">
                        <IconMapper name={event.icon} className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl font-bold text-cream-100 mb-3 text-glow-pink">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-sm text-cream-100/70 leading-relaxed font-light">
                      {event.description}
                    </p>
                  </motion.div>
                </motion.div>

                {/* 3. Empty opposite column spacing placeholder (Desktop) */}
                <div className="w-[44%] hidden md:block" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
