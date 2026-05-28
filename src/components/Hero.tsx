import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BIRTHDAY_CONFIG } from "../data/memories";

/* ──────────────────────────────────────────────
   Balloon component – a single pastel balloon
   with string physics and gentle drift
   ────────────────────────────────────────────── */
interface BalloonProps {
  color: string;
  glowColor: string;
  size: number;
  left: string;
  delay: number;
  duration: number;
  drift: number;        // horizontal sway amplitude (px)
  photoUrl?: string;    // tiny photo attached to balloon
  isHeart?: boolean;
  opacity?: number;
}

const Balloon: React.FC<BalloonProps> = ({
  color, glowColor, size, left, delay, duration, drift,
  photoUrl, isHeart, opacity = 1,
}) => {
  const stringLength = size * 1.8;

  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none select-none"
      style={{ left, zIndex: 2 }}
      initial={{ y: "110vh", opacity: 0 }}
      animate={{
        y: ["-10vh", "-120vh"],
        x: [0, drift, -drift * 0.6, drift * 0.3, 0],
        opacity: [0, opacity, opacity, opacity, 0],
      }}
      transition={{
        y: { duration, repeat: Infinity, ease: "linear", delay },
        x: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration, repeat: Infinity, ease: "linear", delay },
      }}
    >
      <div className="flex flex-col items-center">
        {/* Balloon body */}
        {isHeart ? (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg" style={{ filter: `drop-shadow(0 0 ${size / 3}px ${glowColor})` }}>
            <path
              d="M50 88 C25 65, 0 45, 0 28 C0 12, 12 0, 28 0 C38 0, 46 6, 50 14 C54 6, 62 0, 72 0 C88 0, 100 12, 100 28 C100 45, 75 65, 50 88Z"
              fill={color}
              opacity={0.85}
            />
            <path
              d="M50 88 C25 65, 0 45, 0 28 C0 12, 12 0, 28 0 C38 0, 46 6, 50 14"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg width={size} height={size * 1.15} viewBox="0 0 100 115" className="drop-shadow-lg" style={{ filter: `drop-shadow(0 0 ${size / 4}px ${glowColor})` }}>
            {/* Balloon oval */}
            <ellipse cx="50" cy="45" rx="42" ry="45" fill={color} opacity={0.8} />
            {/* Shine highlight */}
            <ellipse cx="35" cy="30" rx="12" ry="18" fill="rgba(255,255,255,0.2)" transform="rotate(-15 35 30)" />
            {/* Knot */}
            <polygon points="46,90 50,100 54,90" fill={color} opacity={0.9} />
          </svg>
        )}

        {/* String with gentle wave */}
        <svg width="6" height={stringLength} viewBox={`0 0 6 ${stringLength}`} className="overflow-visible">
          <motion.path
            d={`M3 0 Q0 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q6 ${stringLength * 0.7}, 3 ${stringLength}`}
            fill="none"
            stroke="rgba(255,183,197,0.35)"
            strokeWidth="0.8"
            animate={{
              d: [
                `M3 0 Q0 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q6 ${stringLength * 0.7}, 3 ${stringLength}`,
                `M3 0 Q6 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q0 ${stringLength * 0.7}, 3 ${stringLength}`,
                `M3 0 Q0 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q6 ${stringLength * 0.7}, 3 ${stringLength}`,
              ],
            }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Tiny photo attached to balloon string */}
        {photoUrl && (
          <motion.div
            className="mt-1 rounded-sm overflow-hidden border border-white/30 shadow-lg"
            style={{ width: size * 0.55, height: size * 0.55 }}
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────
   Sparkle – a tiny glowing star
   ────────────────────────────────────────────── */
const Sparkle: React.FC<{ x: string; y: string; delay: number; size: number }> = ({ x, y, delay, size }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, background: "white" }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.9, 0],
      scale: [0, 1, 0],
      boxShadow: [
        "0 0 0px rgba(255,255,255,0)",
        `0 0 ${size * 3}px rgba(255,215,0,0.6)`,
        "0 0 0px rgba(255,255,255,0)",
      ],
    }}
    transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ──────────────────────────────────────────────
   Ambient Light Ray
   ────────────────────────────────────────────── */
const LightRay: React.FC<{ angle: number; delay: number }> = ({ angle, delay }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 origin-bottom-left pointer-events-none"
    style={{
      width: "2px",
      height: "50vh",
      background: "linear-gradient(to top, rgba(255,183,197,0.06), transparent)",
      transform: `rotate(${angle}deg)`,
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.4, 0] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ──────────────────────────────────────────────
   MAIN HERO COMPONENT
   ────────────────────────────────────────────── */
export const Hero: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % BIRTHDAY_CONFIG.romanticPhrases.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Pre-compute balloon configs so they don't re-randomize on re-render
  const balloons = useMemo(() => [
    { color: "rgba(255,182,193,0.7)", glowColor: "rgba(255,182,193,0.4)", size: 55, left: "8%",  delay: 0,   duration: 22, drift: 30,  isHeart: false },
    { color: "rgba(216,191,255,0.65)", glowColor: "rgba(167,139,250,0.4)", size: 42, left: "18%", delay: 3,   duration: 26, drift: -20, isHeart: false },
    { color: "rgba(255,215,150,0.6)", glowColor: "rgba(255,215,0,0.3)",   size: 48, left: "78%", delay: 1,   duration: 24, drift: -25, isHeart: false },
    { color: "rgba(255,130,160,0.7)", glowColor: "rgba(255,130,160,0.5)", size: 38, left: "88%", delay: 5,   duration: 28, drift: 15,  isHeart: true },
    { color: "rgba(255,220,230,0.55)", glowColor: "rgba(255,183,197,0.3)", size: 60, left: "60%", delay: 2,   duration: 30, drift: 35,  isHeart: false, photoUrl: BIRTHDAY_CONFIG.memoriesPhotos[0]?.url },
    { color: "rgba(200,180,255,0.5)", glowColor: "rgba(167,139,250,0.3)", size: 50, left: "35%", delay: 7,   duration: 25, drift: -18, isHeart: false },
    { color: "rgba(255,160,180,0.65)", glowColor: "rgba(255,160,180,0.4)", size: 35, left: "92%", delay: 4,   duration: 20, drift: 12,  isHeart: true },
    { color: "rgba(255,245,200,0.45)", glowColor: "rgba(255,215,0,0.25)", size: 44, left: "50%", delay: 8,   duration: 32, drift: -28, isHeart: false, photoUrl: BIRTHDAY_CONFIG.memoriesPhotos[1]?.url },
    { color: "rgba(255,200,210,0.5)", glowColor: "rgba(255,183,197,0.35)", size: 30, left: "5%",  delay: 10,  duration: 18, drift: 20,  isHeart: false },
    { color: "rgba(180,160,255,0.5)", glowColor: "rgba(139,92,246,0.35)", size: 36, left: "70%", delay: 6,   duration: 27, drift: -15, isHeart: true },
  ], []);

  const sparkles = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      x: `${5 + Math.random() * 90}%`,
      y: `${5 + Math.random() * 90}%`,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 3,
    })),
  []);

  return (
    <div
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden"
      id="hero-section"
    >
      {/* ─── LAYER 1: Deep Background Aurora ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Radial aurora blobs */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)", top: "-20%", left: "-10%" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[100px] opacity-15"
          style={{ background: "radial-gradient(circle, rgba(255,183,197,0.5), transparent 70%)", bottom: "-15%", right: "-5%" }}
          animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[40vw] h-[40vw] md:w-[25vw] md:h-[25vw] rounded-full blur-[80px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.4), transparent 70%)", top: "40%", right: "20%" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Soft light rays */}
        {[15, 75, 135, 200, 260, 320].map((angle, i) => (
          <LightRay key={i} angle={angle} delay={i * 0.8} />
        ))}
      </div>

      {/* ─── LAYER 2: Sparkles / Stars ─── */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {sparkles.map((s, i) => (
          <Sparkle key={i} {...s} />
        ))}
      </div>

      {/* ─── LAYER 3: Balloons (behind text) ─── */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {balloons.map((b, i) => (
          <Balloon key={i} {...b} />
        ))}
      </div>

      {/* ─── LAYER 4: Main Content – Clean Centered Typography ─── */}
      <div className="relative z-10 flex flex-col items-center select-none pointer-events-none px-6 max-w-4xl mx-auto">
        
        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-pink-300/60 to-transparent mb-8 origin-center"
        />

        {/* Subtitle */}
        <motion.span
          initial={{ opacity: 0, y: 10, letterSpacing: "0.15em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.5em" }}
          transition={{ duration: 2.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-pink-300/80 font-sans font-medium text-[10px] md:text-xs uppercase mb-6 text-glow-pink tracking-widest"
        >
          A Love Story Written in Starlight
        </motion.span>

        {/* Main Title */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] font-bold text-cream-100 leading-[0.9] tracking-tight text-center"
            style={{ textShadow: "0 0 60px rgba(255,183,197,0.15), 0 0 120px rgba(255,183,197,0.08)" }}
          >
            Happy Birthday
          </motion.h1>
        </div>

        {/* Partner Name with gradient */}
        <div className="overflow-hidden mt-3 md:mt-5">
          <motion.h2
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-signature text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-gold-400 to-pink-300 bg-[length:200%_auto] text-center"
            style={{
              animation: "shimmer 4s ease-in-out infinite",
              textShadow: "0 0 40px rgba(255,215,0,0.2)",
            }}
          >
            {BIRTHDAY_CONFIG.partnerName}
          </motion.h2>
        </div>

        {/* Elegant heart divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          className="my-6 md:my-8"
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl md:text-4xl inline-block drop-shadow-[0_0_20px_rgba(255,183,197,0.6)]"
          >
            ❤️
          </motion.span>
        </motion.div>

        {/* Romantic phrase carousel */}
        <div className="h-14 md:h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={carouselIndex}
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              className="font-handwritten text-2xl sm:text-3xl md:text-4xl text-gold-400/90 font-bold text-center"
              style={{ textShadow: "0 0 20px rgba(255,215,0,0.25)" }}
            >
              {BIRTHDAY_CONFIG.romanticPhrases[carouselIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mt-8 origin-center"
        />
      </div>

      {/* ─── LAYER 5: Dreamy Haze Vignette ─── */}
      <div className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.5) 100%)",
        }}
      />

      {/* ─── LAYER 6: Scroll Indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-8 md:bottom-12 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-pink-300/40 flex items-start justify-center pt-1.5"
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-pink-300/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-pink-300/50 mt-1">
          Scroll
        </span>
      </motion.div>
    </div>
  );
};
