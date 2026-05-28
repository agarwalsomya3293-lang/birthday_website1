import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BIRTHDAY_CONFIG } from "../data/memories";
import { Heart, Gift } from "lucide-react";
import { useAudioStore } from "../store";

/* ──────────────────────────────────────────────
   Types & Interfaces
   ────────────────────────────────────────────── */
interface FloatingPetal {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  type: "petal" | "heart" | "bokeh";
}

interface GiftParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

/* ──────────────────────────────────────────────
   Lantern / Glass / Heart Balloon Component
   ────────────────────────────────────────────── */
const RomanticBalloon: React.FC<{
  type: "heart" | "glass" | "lantern";
  color: string;
  glowColor: string;
  size: number;
  left: string;
  delay: number;
  duration: number;
  drift: number;
  photoUrl?: string;
}> = ({ type, color, glowColor, size, left, delay, duration, drift, photoUrl }) => {
  const stringLength = size * 1.5;

  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none select-none"
      style={{ left, zIndex: type === "glass" ? 1 : 3 }}
      initial={{ y: "110vh", opacity: 0 }}
      animate={{
        y: ["-10vh", "-130vh"],
        x: [0, drift, -drift * 0.8, drift * 0.4, 0],
        opacity: [0, 0.9, 0.9, 0.9, 0],
      }}
      transition={{
        y: { duration, repeat: Infinity, ease: "linear", delay },
        x: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration, repeat: Infinity, ease: "linear", delay },
      }}
    >
      <div className="flex flex-col items-center">
        {type === "heart" && (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg" style={{ filter: `drop-shadow(0 0 ${size / 3}px ${glowColor})` }}>
            <path
              d="M50 88 C25 65, 0 45, 0 28 C0 12, 12 0, 28 0 C38 0, 46 6, 50 14 C54 6, 62 0, 72 0 C88 0, 100 12, 100 28 C100 45, 75 65, 50 88Z"
              fill={color}
              opacity={0.85}
            />
          </svg>
        )}

        {type === "glass" && (
          <div
            className="rounded-full border border-white/40 relative shadow-inner overflow-hidden"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 182, 193, 0.2) 80%)`,
              backdropFilter: "blur(2px)",
              filter: `drop-shadow(0 0 ${size / 2}px ${glowColor})`,
            }}
          >
            {/* Soft internal glare line */}
            <div className="absolute top-1 left-2 w-3 h-6 bg-white/40 rounded-full rotate-12" />
          </div>
        )}

        {type === "lantern" && (
          <div
            className="relative flex flex-col items-center"
            style={{
              width: size,
              height: size * 1.2,
              background: `radial-gradient(circle, #ffe3a0 20%, #ff9e4f 70%, #d84b16 100%)`,
              borderRadius: "50% 50% 45% 45%",
              filter: `drop-shadow(0 0 ${size / 2}px rgba(255,180,50,0.8))`,
              boxShadow: "0 0 15px rgba(255,200,100,0.5), inset 0 0 10px rgba(255,255,255,0.4)",
            }}
          >
            {/* Candle glow center */}
            <div className="absolute bottom-2 w-3 h-5 bg-white rounded-full blur-[2px] animate-pulse" />
            {/* Tassel */}
            <div className="absolute -bottom-3 w-1 h-3 bg-red-600/80 rounded-full" />
          </div>
        )}

        {/* Delicate string with slow wave animation */}
        <svg width="6" height={stringLength} viewBox={`0 0 6 ${stringLength}`} className="overflow-visible opacity-50">
          <motion.path
            d={`M3 0 Q0 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q6 ${stringLength * 0.7}, 3 ${stringLength}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.8"
            animate={{
              d: [
                `M3 0 Q0 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q6 ${stringLength * 0.7}, 3 ${stringLength}`,
                `M3 0 Q6 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q0 ${stringLength * 0.7}, 3 ${stringLength}`,
                `M3 0 Q0 ${stringLength * 0.3}, 3 ${stringLength * 0.5} Q6 ${stringLength * 0.7}, 3 ${stringLength}`,
              ],
            }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {photoUrl && (
          <motion.div
            className="mt-1 p-0.5 bg-white/90 rounded border border-white/50 shadow-lg origin-top"
            style={{ width: size * 0.8, height: size * 0.8 }}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={photoUrl} alt="" className="w-full h-full object-cover rounded-sm" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────
   MAIN HERO REDESIGN COMPONENT
   ────────────────────────────────────────────── */
export const Hero: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [giftParticles, setGiftParticles] = useState<GiftParticle[]>([]);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax values using springs for butter smooth motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const bgX = useTransform(parallaxX, (v: number) => v * -15);
  const bgY = useTransform(parallaxY, (v: number) => v * -15);
  const polaroidsX = useTransform(parallaxX, (v: number) => v * 25);
  const polaroidsY = useTransform(parallaxY, (v: number) => v * 25);
  const titleX = useTransform(parallaxX, (v: number) => v * 35);
  const titleY = useTransform(parallaxY, (v: number) => v * 35);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX / width - 0.5) * 2; // -1 to 1
      const y = (e.clientY / height - 0.5) * 2; // -1 to 1
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Rotate romantic phrases
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % BIRTHDAY_CONFIG.romanticPhrases.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Pre-compute petals, sparkles, and cloud layouts to prevent layout shifts
  const stars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 85}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
  }, []);

  const petals = useMemo<FloatingPetal[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 6,
      delay: Math.random() * 8,
      duration: Math.random() * 15 + 10,
      rotate: Math.random() * 360,
      type: Math.random() > 0.6 ? "heart" : Math.random() > 0.3 ? "petal" : "bokeh",
    }));
  }, []);

  const clouds = useMemo(() => [
    { id: 1, left: "-10%", top: "10%", scale: 1.2, delay: 0, opacity: 0.15 },
    { id: 2, right: "-15%", top: "35%", scale: 1.4, delay: 4, opacity: 0.12 },
    { id: 3, left: "20%", bottom: "5%", scale: 1.6, delay: 2, opacity: 0.18 },
  ], []);

  const balloonsList = useMemo(() => [
    { type: "heart" as const, color: "rgba(255,100,130,0.8)", glowColor: "rgba(255,100,130,0.5)", size: 60, left: "10%", delay: 1, duration: 25, drift: 40 },
    { type: "glass" as const, color: "rgba(255,255,255,0.3)", glowColor: "rgba(255,192,203,0.3)", size: 55, left: "25%", delay: 4, duration: 28, drift: -30, photoUrl: BIRTHDAY_CONFIG.memoriesPhotos[0]?.url },
    { type: "lantern" as const, color: "", glowColor: "rgba(255,180,50,0.6)", size: 45, left: "75%", delay: 2, duration: 22, drift: -35 },
    { type: "heart" as const, color: "rgba(255,182,193,0.85)", glowColor: "rgba(255,182,193,0.4)", size: 50, left: "85%", delay: 6, duration: 26, drift: 25, photoUrl: BIRTHDAY_CONFIG.memoriesPhotos[1]?.url },
    { type: "glass" as const, color: "rgba(255,255,255,0.35)", glowColor: "rgba(167,139,250,0.3)", size: 65, left: "45%", delay: 0, duration: 32, drift: 20 },
  ], []);

  // Gift Box Explosion Handler
  const triggerGiftExplosion = (side: "left" | "right") => {
    const particleCount = 28;
    const startX = side === "left" ? window.innerWidth * 0.12 : window.innerWidth * 0.88;
    const startY = window.innerHeight * 0.88;
    const colors = ["#ffb7c5", "#ffd700", "#ff6482", "#ffffff", "#e9d5ff"];

    const newParticles: GiftParticle[] = Array.from({ length: particleCount }, (_, idx) => {
      const angle = (Math.random() * Math.PI) / 2 + (side === "left" ? -Math.PI / 6 : -Math.PI * 0.7);
      const speed = Math.random() * 8 + 6;
      return {
        id: Date.now() + idx,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 6,
      };
    });

    setGiftParticles((prev) => [...prev, ...newParticles]);
  };

  // Gift particles physics tick
  useEffect(() => {
    if (giftParticles.length === 0) return;
    const interval = setInterval(() => {
      setGiftParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3, // Gravity
            vx: p.vx * 0.98, // Air drag
          }))
          .filter((p) => p.y < window.innerHeight && p.x > 0 && p.x < window.innerWidth)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [giftParticles]);

  const handleMusicToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-love-music"));
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-cosmic-black"
      id="hero-section"
    >
      {/* ─── LUXURY GLASSMORPHIC TOP NAVBAR ─── */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center z-50 pointer-events-auto"
      >
        {/* Brand / Monogram */}
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-300 drop-shadow-[0_0_8px_rgba(255,183,197,0.6)] animate-pulse" />
          <span className="font-sans font-semibold tracking-[0.3em] text-xs uppercase text-cream-100/90 text-glow-pink">
            Forever & Always
          </span>
        </div>

        {/* Minimalist Glass Nav Links */}
        <nav className="hidden md:flex items-center gap-8 glass-panel px-8 py-2.5 rounded-full border border-white/10 shadow-lg">
          {["Gallery", "Timeline", "Love Cards", "Letter", "Countdown"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="relative text-[10px] uppercase font-sans font-medium tracking-[0.2em] text-pink-300/80 hover:text-white transition-colors duration-300 group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pink-300 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,183,197,0.8)]" />
            </a>
          ))}
        </nav>

        {/* Interactive Music Toggle with Audio Wave */}
        <button
          onClick={handleMusicToggle}
          className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-pink-300/20 hover:border-pink-300/60 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-cream-100"
        >
          <div className="flex gap-0.5 items-end h-3">
            <span className={`w-0.5 bg-pink-300 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.8s_infinite_0.1s] h-3" : "h-1.5"}`} />
            <span className={`w-0.5 bg-pink-400 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.6s_infinite_0.3s] h-3.5" : "h-2"}`} />
            <span className={`w-0.5 bg-gold-400 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.9s_infinite_0.2s] h-3" : "h-1"}`} />
          </div>
          <span className="text-[9px] uppercase tracking-widest font-sans font-medium text-pink-300/90">
            {isPlaying ? "Music On" : "Music Off"}
          </span>
        </button>
      </motion.header>

      {/* ─── LAYER 1: Parallax Dreamy Sunset Galaxy Backdrop ─── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          x: bgX,
          y: bgY,
        }}
      >
        {/* Purple/Pink Galaxy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#100720] via-[#240b36] to-[#050508] opacity-95" />

        {/* Ambient Auroral Glow Blobs */}
        <motion.div
          className="absolute w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[140px] opacity-25"
          style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent 70%)", top: "-10%", left: "10%" }}
          animate={{ scale: [1, 1.12, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(167, 139, 250, 0.35), transparent 70%)", bottom: "10%", right: "10%" }}
          animate={{ scale: [1.1, 0.95, 1.1], rotate: [90, 0, 90] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dreamy Clouds with Soft Internal Glow */}
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            className="absolute rounded-full pointer-events-none blur-[40px]"
            style={{
              width: "45vw",
              height: "22vw",
              background: "radial-gradient(circle, rgba(255, 182, 193, 0.15) 10%, rgba(139, 92, 246, 0.05) 50%, transparent 80%)",
              opacity: cloud.opacity,
              ...("left" in cloud ? { left: cloud.left } : { right: cloud.right }),
              ...("top" in cloud ? { top: cloud.top } : { bottom: cloud.bottom }),
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -10, 10, 0],
            }}
            transition={{
              duration: 25,
              delay: cloud.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* ─── LAYER 2: Stars, Sparkles & Magical Petals ─── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Slower drifting custom particles (bokeh/petals) */}
        {petals.map((p) => {
          let content = null;
          if (p.type === "heart") {
            content = <Heart className="text-pink-300/40 drop-shadow-[0_0_6px_rgba(255,183,197,0.4)]" style={{ width: p.size, height: p.size }} fill="rgba(255,183,197,0.15)" />;
          } else if (p.type === "petal") {
            content = (
              <svg width={p.size} height={p.size} viewBox="0 0 20 20" fill="none">
                <path d="M10 0C10 0 16 6 16 11C16 15 13 18 10 18C7 18 4 15 4 11C4 6 10 0 10 0Z" fill="rgba(244, 63, 94, 0.25)" className="drop-shadow-[0_0_4px_rgba(244,63,94,0.3)]" />
              </svg>
            );
          } else {
            content = (
              <div
                className="rounded-full bg-gradient-to-tr from-pink-300/10 to-gold-400/20 blur-[2px]"
                style={{ width: p.size, height: p.size }}
              />
            );
          }
          return (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              animate={{
                y: ["0vh", "-110vh"],
                x: ["0vw", `${Math.sin(p.id) * 8}vw`],
                rotate: [p.rotate, p.rotate + 360],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {content}
            </motion.div>
          );
        })}

        {/* Flickering stars background */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white shadow-glow"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            }}
            animate={{
              opacity: [0.1, 1, 0.1],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 2 + star.size,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ─── LAYER 3: Balloons Experience ─── */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {balloonsList.map((balloon, index) => (
          <RomanticBalloon key={index} {...balloon} />
        ))}
      </div>

      {/* ─── LAYER 4: Symmetrical Polaroids Composition ─── */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-16 max-w-7xl mx-auto w-full"
        style={{
          x: polaroidsX,
          y: polaroidsY,
        }}
      >
        {/* Left Floating Polaroid Card */}
        {BIRTHDAY_CONFIG.memoriesPhotos[0] && (
          <motion.div
            className="hidden lg:block pointer-events-auto select-none"
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: -2, zIndex: 40 }}
          >
            <div className="polaroid-frame w-56 shadow-2xl relative">
              {/* Retro scrapbook tape effect */}
              <div className="absolute -top-3 left-12 w-16 h-6 bg-pink-300/30 backdrop-blur-sm -rotate-6 border border-white/20" />
              <div className="polaroid-img-container rounded">
                <img
                  src={BIRTHDAY_CONFIG.memoriesPhotos[0].url}
                  alt=""
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <p className="font-handwritten text-lg mt-3 text-center text-space-purple/90 font-bold leading-tight px-1">
                {BIRTHDAY_CONFIG.memoriesPhotos[0].caption}
              </p>
            </div>
          </motion.div>
        )}

        {/* Right Floating Polaroid Card */}
        {BIRTHDAY_CONFIG.memoriesPhotos[1] && (
          <motion.div
            className="hidden lg:block pointer-events-auto select-none"
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 1.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: 2, zIndex: 40 }}
          >
            <div className="polaroid-frame w-56 shadow-2xl relative">
              {/* Retro scrapbook tape effect */}
              <div className="absolute -top-3 right-12 w-16 h-6 bg-pink-300/30 backdrop-blur-sm rotate-6 border border-white/20" />
              <div className="polaroid-img-container rounded">
                <img
                  src={BIRTHDAY_CONFIG.memoriesPhotos[1].url}
                  alt=""
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <p className="font-handwritten text-lg mt-3 text-center text-space-purple/90 font-bold leading-tight px-1">
                {BIRTHDAY_CONFIG.memoriesPhotos[1].caption}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ─── LAYER 5: Centered Hero Typography & Message ─── */}
      <motion.div
        className="relative z-40 flex flex-col items-center justify-center text-center px-4 max-w-3xl my-auto pointer-events-none select-none"
        style={{
          x: titleX,
          y: titleY,
        }}
      >
        {/* Soft luxury gold line divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mb-6"
        />

        {/* Elegant Subtitle */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 0.2 }}
          className="font-sans font-semibold text-[10px] md:text-xs tracking-[0.45em] text-pink-300 uppercase text-glow-pink mb-4"
        >
          To My Beautiful Universe
        </motion.span>

        {/* GRAND GLOWING TITLES */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-7xl md:text-[6.5rem] font-bold text-cream-100 leading-none tracking-tight"
            style={{
              textShadow: "0 0 40px rgba(255,183,197,0.3), 0 0 80px rgba(255,183,197,0.15)",
            }}
          >
            Happy Birthday
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-1">
          <motion.h2
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-signature text-6xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-gold-400 to-pink-300 bg-[length:200%_auto] pb-3"
            style={{
              animation: "shimmer 5s ease-in-out infinite",
              filter: "drop-shadow(0 0 25px rgba(255,183,197,0.45))",
            }}
          >
            {BIRTHDAY_CONFIG.partnerName}
          </motion.h2>
        </div>

        {/* Heart icon pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="my-3"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-pink-300 drop-shadow-[0_0_15px_rgba(255,182,193,0.8)]"
          >
            <Heart className="w-8 h-8 fill-pink-300/30 text-pink-300" />
          </motion.div>
        </motion.div>

        {/* Elegant message slider */}
        <div className="h-16 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={carouselIndex}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="font-handwritten text-xl sm:text-2xl md:text-3xl text-gold-400/90 font-bold"
              style={{ textShadow: "0 0 10px rgba(255,215,0,0.3)" }}
            >
              {BIRTHDAY_CONFIG.romanticPhrases[carouselIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── LAYER 6: Bottom Symmetrical Gift Boxes ─── */}
      <div className="absolute bottom-8 left-0 right-0 z-40 px-8 pointer-events-none flex justify-between items-end w-full max-w-7xl mx-auto">
        
        {/* Left Gift Box */}
        <motion.div
          className="pointer-events-auto cursor-pointer"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          whileHover={{ scale: 1.15, y: -5 }}
          onClick={() => triggerGiftExplosion("left")}
        >
          <div className="relative group flex flex-col items-center">
            {/* Soft lighting bloom behind the gift */}
            <div className="absolute inset-0 bg-pink-400/10 rounded-full blur-xl group-hover:bg-pink-400/25 transition-all duration-300" />
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-pink-300 rounded-lg shadow-lg flex items-center justify-center border border-white/20 relative">
              <Gift className="w-6 h-6 text-cream-100 animate-[bounce_2s_infinite]" />
              {/* Ribbon line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gold-400 -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gold-400 -translate-y-1/2" />
            </div>
            <span className="text-[7px] uppercase tracking-widest text-pink-300/80 mt-1 font-sans">
              Click Me
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="flex flex-col items-center gap-1.5 pb-2"
        >
          <div className="w-4 h-7 rounded-full border border-pink-300/30 flex items-start justify-center pt-1">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-pink-300/60"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="font-sans text-[7px] uppercase tracking-[0.3em] text-pink-300/50">
            Scroll Down
          </span>
        </motion.div>

        {/* Right Gift Box */}
        <motion.div
          className="pointer-events-auto cursor-pointer"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.4 }}
          whileHover={{ scale: 1.15, y: -5 }}
          onClick={() => triggerGiftExplosion("right")}
        >
          <div className="relative group flex flex-col items-center">
            <div className="absolute inset-0 bg-gold-400/10 rounded-full blur-xl group-hover:bg-gold-400/25 transition-all duration-300" />
            <div className="w-12 h-12 bg-gradient-to-tr from-gold-500 to-gold-400 rounded-lg shadow-lg flex items-center justify-center border border-white/20 relative">
              <Gift className="w-6 h-6 text-cream-100 animate-[bounce_2s_infinite_0.5s]" />
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-pink-400 -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-pink-400 -translate-y-1/2" />
            </div>
            <span className="text-[7px] uppercase tracking-widest text-gold-400/80 mt-1 font-sans">
              Click Me
            </span>
          </div>
        </motion.div>
      </div>

      {/* ─── LAYER 7: Render Explosions Particles ─── */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {giftParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: `drop-shadow(0 0 6px ${p.color})`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
