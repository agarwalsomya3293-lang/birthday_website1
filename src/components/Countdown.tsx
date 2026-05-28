import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Gift, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "../data/memories";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  const [showWishModal, setShowWishModal] = useState(false);

  // 1. Live Countdown Loop
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(BIRTHDAY_CONFIG.birthdayDate).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Multi-Directional Confetti Fireworks Explosion
  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Firework shells from corners
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleMakeWish = () => {
    setShowWishModal(true);
    triggerFireworks();
  };

  return (
    <section className="relative py-24 px-6 md:px-12 bg-gradient-to-b from-cosmic-black via-space-purple/15 to-cosmic-black overflow-hidden flex flex-col justify-center items-center" id="countdown-section">
      {/* Dynamic drifting background particles */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Confetti decoration floating in background */}
      <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, rgba(5,5,8,0.9) 100%) pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* Section Title */}
        <div className="text-center mb-16 select-none">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold-400 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-glow-gold"
          >
            Chapter VI
          </motion.span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mt-3 text-glow-pink">
            Birthday Countdown & Wish
          </h2>
        </div>

        {/* The Live Countdown Display Panel */}
        <div className="glass-panel border border-pink-300/20 rounded-3xl p-8 sm:p-12 w-full max-w-2xl text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden select-none">
          
          {/* Inner glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/5 to-purple-900/5 pointer-events-none" />

          {/* Conditional state: Counting Down vs Completed Birthday */}
          {!timeLeft.isCompleted ? (
            <div>
              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-6 text-cream-100">
                {/* Days */}
                <div className="flex flex-col items-center">
                  <span className="font-serif text-4xl sm:text-6xl font-bold text-glow-pink font-mono tracking-tight">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-pink-300/60 mt-2">
                    Days
                  </span>
                </div>
                {/* Hours */}
                <div className="flex flex-col items-center border-l border-white/10">
                  <span className="font-serif text-4xl sm:text-6xl font-bold text-glow-pink font-mono tracking-tight">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-pink-300/60 mt-2">
                    Hours
                  </span>
                </div>
                {/* Minutes */}
                <div className="flex flex-col items-center border-l border-white/10">
                  <span className="font-serif text-4xl sm:text-6xl font-bold text-glow-pink font-mono tracking-tight">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-pink-300/60 mt-2">
                    Mins
                  </span>
                </div>
                {/* Seconds */}
                <div className="flex flex-col items-center border-l border-white/10">
                  <span className="font-serif text-4xl sm:text-6xl font-bold text-gold-400 text-glow-gold font-mono tracking-tight">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-gold-500/70 mt-2">
                    Secs
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-8 text-pink-300/60 font-sans text-[9px] uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-pink-300" />
                <span>Ticking until your absolute special moment</span>
              </div>
            </div>
          ) : (
            <div className="py-4">
              {/* Special celebration title */}
              <motion.h3 
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="font-serif text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-gold-400 to-pink-300 bg-[length:200%_auto] animate-[pulse_6s_ease_infinite] text-glow-gold"
              >
                Today is the Day! 🎉
              </motion.h3>
              <p className="font-sans text-xs tracking-widest text-cream-100/75 uppercase mt-3">
                Happy Birthday to the one who holds my entire heart!
              </p>
            </div>
          )}
        </div>

        {/* The glowing "Make a Wish" Trigger button */}
        <div className="relative">
          {/* External pulse glow */}
          <div className="absolute inset-0 rounded-full blur-[20px] bg-pink-500/20 animate-pulse pointer-events-none" />
          
          <button
            onClick={handleMakeWish}
            className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-pink-400 via-purple-600 to-gold-400 text-cream-100 font-bold tracking-wider hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(255,183,197,0.3)] hover:shadow-[0_20px_50px_rgba(255,183,197,0.5)] z-10 hover-trigger flex items-center gap-2 border border-white/20 uppercase text-xs sm:text-sm"
          >
            {/* Sliding backdrop light */}
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span>Make a Birthday Wish</span>
            <Gift className="w-4 h-4 text-cream-100" />
          </button>
        </div>

      </div>

      {/* Floating Birthday Wish Modal Overlay */}
      <AnimatePresence>
        {showWishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setShowWishModal(false)}
          >
            {/* Pulsating Modal Panel */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1
              }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative max-w-md w-full glass-panel-heavy border-2 border-pink-300/40 rounded-3xl p-8 sm:p-12 text-center shadow-[0_25px_60px_rgba(255,183,197,0.3)] select-none flex flex-col justify-center items-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing on clicking modal content
            >
              {/* Close top button */}
              <button
                onClick={() => setShowWishModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-cream-100/60 hover:text-cream-100 transition-colors hover-trigger"
              >
                <XIcon className="w-4 h-4" />
              </button>

              {/* Heart Beat Indicator */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-pink-500/10 border border-pink-400/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-8 animate-pulse-heart">
                <Heart className="w-10 h-10 fill-red-400" />
              </div>

              {/* Header */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mb-4 text-glow-pink">
                Wish Registered! ✨
              </h3>

              {/* Cursive message */}
              <p className="font-handwritten text-xl sm:text-2xl font-bold leading-relaxed text-cream-100/90 mb-8 px-2">
                "Close your eyes, make a beautiful wish... may every single one of your dreams find its path to you. Happy Birthday, my whole universe!"
              </p>

              {/* Close Button */}
              <button
                onClick={() => setShowWishModal(false)}
                className="px-6 py-2.5 rounded-full border border-pink-300/30 hover:border-pink-300/60 font-sans text-[10px] font-bold uppercase tracking-widest text-pink-300 transition-all hover:bg-pink-300/10 hover-trigger"
              >
                Return to universe
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Simple visual X icon
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
