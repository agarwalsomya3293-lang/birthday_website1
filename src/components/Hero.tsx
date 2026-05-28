import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BIRTHDAY_CONFIG } from "../data/memories";
import { Heart, Camera, BookOpen, Clock, Star, Sparkles } from "lucide-react";
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
  type: "petal" | "heart" | "lantern" | "sparkle";
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  opacity: number;
}

/* ──────────────────────────────────────────────
   MAIN HERO REDESIGN COMPONENT
   ────────────────────────────────────────────── */
export const Hero: React.FC = () => {
  const [fountainParticles, setFountainParticles] = useState<SparkleParticle[]>([]);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const bgX = useTransform(parallaxX, (v: number) => v * -12);
  const bgY = useTransform(parallaxY, (v: number) => v * -12);
  const elementsX = useTransform(parallaxX, (v: number) => v * 20);
  const elementsY = useTransform(parallaxY, (v: number) => v * 20);
  const titleX = useTransform(parallaxX, (v: number) => v * 30);
  const titleY = useTransform(parallaxY, (v: number) => v * 30);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX / width - 0.5) * 2;
      const y = (e.clientY / height - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Sparkle Fountain Effect from the Left open gift box
  useEffect(() => {
    const interval = setInterval(() => {
      const pCount = 3;
      const newParticles: SparkleParticle[] = Array.from({ length: pCount }, (_, i) => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6; // upward cone
        const speed = Math.random() * 3 + 2;
        return {
          id: Date.now() + i + Math.random(),
          x: 0, // offset from fountain start
          y: 0,
          size: Math.random() * 8 + 4,
          color: Math.random() > 0.4 ? "rgba(255,183,197,0.85)" : "rgba(255,215,0,0.85)",
          angle,
          speed,
          opacity: 1,
        };
      });

      setFountainParticles((prev) =>
        [...prev, ...newParticles]
          .map((p) => {
            const nextX = p.x + Math.cos(p.angle) * p.speed;
            const nextY = p.y + Math.sin(p.angle) * p.speed - 0.5; // slight upward drift gravity
            return {
              ...p,
              x: nextX,
              y: nextY,
              opacity: p.opacity - 0.015,
            };
          })
          .filter((p) => p.opacity > 0)
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const ambientItems = useMemo<FloatingPetal[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 90 + 10,
      size: Math.random() * 15 + 8,
      delay: Math.random() * 5,
      duration: Math.random() * 12 + 10,
      rotate: Math.random() * 360,
      type: Math.random() > 0.7 ? "heart" : Math.random() > 0.4 ? "lantern" : "petal",
    }));
  }, []);

  const handleMusicToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-love-music"));
  };

  // Scroll to next section handler
  const handleScrollDown = () => {
    const nextSection = document.getElementById("hero-section")?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-cosmic-black"
      id="hero-section"
    >
      {/* ─── NAVBAR ─── */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center z-50 pointer-events-auto select-none"
      >
        <div className="flex items-center gap-1.5">
          <span className="font-handwritten text-lg text-pink-300 drop-shadow-[0_0_8px_rgba(255,183,197,0.5)]">
            made with ♡
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 glass-panel px-8 py-2 rounded-full border border-white/10 shadow-lg">
          {["Home", "Our Story", "Memories", "Timeline", "Reasons", "Gallery", "Surprises"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="relative text-[11px] uppercase font-sans font-semibold tracking-wider text-pink-300/80 hover:text-white transition-colors duration-300 group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-pink-300 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,183,197,0.8)]" />
            </a>
          ))}
        </nav>

        <button
          onClick={handleMusicToggle}
          className="flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full border border-pink-300/20 hover:border-pink-300/60 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-cream-100"
        >
          <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-pink-300">
            {isPlaying ? "♬ Music: On" : "♬ Music: Off"}
          </span>
        </button>
      </motion.header>

      {/* ─── FAIRY LIGHTS ON TOP LEFT ─── */}
      <div className="absolute top-0 left-0 w-[45%] h-[200px] pointer-events-none z-30 opacity-80">
        <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" className="overflow-visible">
          <path
            d="M -10,-10 Q 100,80 220,10 T 420,-10"
            fill="none"
            stroke="rgba(255, 215, 0, 0.2)"
            strokeWidth="1.5"
          />
          {/* Bulb points */}
          {[10, 45, 90, 135, 180, 225, 270, 315, 360].map((cx, i) => {
            // Math helper for approximation of Q curve
            const cy = 40 - Math.pow((cx - 150) / 100, 2) * 8;
            return (
              <g key={i}>
                <line x1={cx} y1={cy - 5} x2={cx} y2={cy} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="#ffe89e"
                  className="animate-pulse"
                  style={{
                    animationDuration: `${1 + Math.random() * 1.5}s`,
                    filter: "drop-shadow(0 0 6px #ffd700) drop-shadow(0 0 12px #ffae19)",
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ─── BACKGROUND LAYERS (Parallax) ─── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ x: bgX, y: bgY }}
      >
        {/* Starry night purple/magenta gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0518] via-[#220735] to-[#12041e] opacity-98" />

        {/* Sunset glow layer on horizon */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[45%] opacity-70"
          style={{
            background: "radial-gradient(ellipse at bottom, rgba(236,72,153,0.3) 0%, rgba(216,180,254,0.1) 50%, transparent 100%)",
          }}
        />

        {/* Star Sparkle background */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
                boxShadow: "0 0 8px #fff",
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>

      {/* ─── AMBIENT ATMOSPHERE PARTICLES (Rose petals / paper lanterns) ─── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {ambientItems.map((item) => {
          if (item.type === "lantern") {
            return (
              <motion.div
                key={item.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                animate={{
                  y: ["100vh", "-20vh"],
                  x: ["0px", `${Math.sin(item.id) * 30}px`],
                }}
                transition={{
                  duration: item.duration * 1.2,
                  delay: item.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div
                  className="rounded"
                  style={{
                    width: item.size * 0.9,
                    height: item.size * 1.2,
                    background: "radial-gradient(circle at center, #ffd275 20%, #e06010 80%)",
                    borderRadius: "4px 4px 2px 2px",
                    filter: "drop-shadow(0 0 10px rgba(224,96,16,0.8))",
                    boxShadow: "0 0 15px rgba(255,190,50,0.4)",
                  }}
                />
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.id}
              className="absolute"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              animate={{
                y: ["0vh", "-110vh"],
                x: ["0px", `${Math.sin(item.id) * 50}px`],
                rotate: [item.rotate, item.rotate + 360],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {item.type === "heart" ? (
                <Heart className="text-pink-400/30 fill-pink-400/10" style={{ width: item.size, height: item.size }} />
              ) : (
                <div
                  className="rounded-full bg-pink-500/20 blur-[1px]"
                  style={{ width: item.size, height: item.size }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ─── MAIN HERO COMPOSITION (Center & Sides) ─── */}
      <div className="w-full max-w-7xl mx-auto px-6 relative flex flex-1 items-center justify-between z-30 pointer-events-none">
        
        {/* LEFT SECTION: Glowing Balloons + Symmetrical Polaroids + Open Gift Box */}
        <motion.div
          className="hidden lg:flex flex-col justify-between h-[80%] w-[25%] pointer-events-auto"
          style={{ x: elementsX, y: elementsY }}
        >
          {/* Heart Balloon */}
          <motion.div
            className="flex flex-col items-center select-none cursor-pointer mt-4"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="relative flex items-center justify-center rounded-full border border-pink-300/30"
              style={{
                width: 100,
                height: 100,
                background: "radial-gradient(circle at 35% 35%, rgba(255,105,180,0.85) 0%, rgba(139,92,246,0.6) 80%)",
                filter: "drop-shadow(0 0 25px rgba(255,105,180,0.5))",
                boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.3)",
              }}
            >
              <span className="font-handwritten text-cream-100 text-sm font-bold tracking-wide">
                You + Me
              </span>
            </div>
            <div className="w-0.5 h-12 bg-white/20" />
          </motion.div>

          {/* Symmetrical Polaroid 1 (Left top-left tilted) */}
          {BIRTHDAY_CONFIG.memoriesPhotos[0] && (
            <motion.div
              className="rotate-[-6deg] self-start cursor-pointer hover:rotate-0 transition-transform duration-300"
              whileHover={{ scale: 1.05, zIndex: 40 }}
            >
              <div className="polaroid-frame w-48 shadow-2xl relative">
                <div className="absolute -top-3 left-10 w-16 h-5 bg-pink-300/20 backdrop-blur-sm -rotate-3 border border-white/10" />
                <div className="polaroid-img-container rounded-sm">
                  <img
                    src={BIRTHDAY_CONFIG.memoriesPhotos[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-handwritten text-sm mt-2 text-center text-space-purple font-bold leading-tight">
                  Our First Meeting
                </p>
              </div>
            </motion.div>
          )}

          {/* Symmetrical Polaroid 2 (Left bottom-right tilted) */}
          {BIRTHDAY_CONFIG.memoriesPhotos[2] && (
            <motion.div
              className="rotate-[8deg] self-end cursor-pointer hover:rotate-0 transition-transform duration-300 -mt-6"
              whileHover={{ scale: 1.05, zIndex: 40 }}
            >
              <div className="polaroid-frame w-48 shadow-2xl relative">
                <div className="absolute -top-3 right-10 w-16 h-5 bg-pink-300/20 backdrop-blur-sm rotate-3 border border-white/10" />
                <div className="polaroid-img-container rounded-sm">
                  <img
                    src={BIRTHDAY_CONFIG.memoriesPhotos[2].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-handwritten text-sm mt-2 text-center text-space-purple font-bold leading-tight">
                  Unforgettable Moments
                </p>
              </div>
            </motion.div>
          )}

          {/* Open Gift Box emitting Sparkle Fountain */}
          <div className="relative mt-8 self-start ml-4 flex flex-col items-center">
            {/* Fountain particle rendering */}
            <div className="absolute -top-16 left-6 pointer-events-none">
              {fountainParticles.map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    opacity: p.opacity,
                    filter: `drop-shadow(0 0 ${p.size}px ${p.color})`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>

            <div className="relative group">
              <div className="w-16 h-12 bg-pink-500 rounded-b-md shadow-lg border border-pink-400/40 relative">
                {/* Open Lid tilted */}
                <div className="absolute -top-4 -left-2 w-20 h-4 bg-pink-400 rounded border border-white/20 rotate-[-12deg] shadow-md flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gold-400 absolute -top-2" />
                </div>
                <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gold-400 -translate-x-1/2" />
              </div>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-pink-300/80 mt-1 font-sans">
              Sparkling magic
            </span>
          </div>
        </motion.div>

        {/* CENTER SECTION: Elegant Titles & Core Message */}
        <motion.div
          className="flex flex-col items-center justify-center text-center flex-1 max-w-2xl px-4 select-none"
          style={{ x: titleX, y: titleY }}
        >
          {/* Subtitle "To My Favorite Person" with heart icons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="flex items-center gap-2 mb-2"
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 drop-shadow-[0_0_8px_rgba(255,183,197,0.6)]" />
            <span className="font-signature text-2xl md:text-3xl text-pink-200 tracking-wide">
              To My Favorite Person
            </span>
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 drop-shadow-[0_0_8px_rgba(255,183,197,0.6)]" />
          </motion.div>

          {/* Huge Main "Happy Birthday" Text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold text-cream-100 leading-none tracking-normal"
            style={{
              textShadow: "0 0 40px rgba(255,183,197,0.25), 0 0 80px rgba(255,183,197,0.1)",
            }}
          >
            Happy
            <br />
            Birthday
          </motion.h1>

          {/* Subtitle "My Love" */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5 }}
            className="font-signature text-5xl md:text-7xl text-pink-300 drop-shadow-[0_0_15px_rgba(255,105,180,0.4)] mt-4 flex items-center gap-3"
          >
            My Love <span className="font-sans text-3xl">♡</span>
          </motion.h2>

          {/* Message Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 2, delay: 1 }}
            className="font-handwritten text-lg sm:text-xl md:text-2xl text-pink-200/90 mt-6 max-w-md font-semibold tracking-wide italic"
          >
            Another year of you being the most beautiful part of my life.
          </motion.p>

          {/* Button: Enter Our Universe */}
          <motion.button
            onClick={handleScrollDown}
            className="pointer-events-auto mt-8 px-8 py-3 rounded-full border border-pink-300/40 text-xs font-sans font-semibold tracking-widest text-cream-100 uppercase bg-white/5 backdrop-blur-md shadow-lg hover:bg-pink-500/20 hover:border-pink-300 hover:shadow-[0_0_20px_rgba(255,183,197,0.4)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter Our Universe 🌸
          </motion.button>
        </motion.div>

        {/* RIGHT SECTION: Hot Air Balloon + Symmetrical Polaroids + Wrapped Gifts */}
        <motion.div
          className="hidden lg:flex flex-col justify-between h-[80%] w-[25%] pointer-events-auto items-end"
          style={{ x: elementsX, y: elementsY }}
        >
          {/* MAGNIFICENT HOT AIR BALLOON (Carrying a bear silhouette, glowing hearts, strings of fairy lights) */}
          <motion.div
            className="flex flex-col items-center select-none cursor-pointer mt-2 mr-6 relative"
            animate={{
              y: [-12, 12, -12],
              rotate: [-2, 2, -2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Balloon envelope */}
            <div
              className="relative flex items-center justify-center shadow-inner rounded-t-full rounded-b-[40px]"
              style={{
                width: 110,
                height: 120,
                background: "radial-gradient(circle at 35% 30%, #ff839b 0%, #d82b56 60%, #850020 100%)",
                filter: "drop-shadow(0 0 30px rgba(216,43,86,0.6))",
                boxShadow: "inset -6px -6px 15px rgba(0,0,0,0.5), inset 6px 6px 15px rgba(255,255,255,0.2)",
              }}
            >
              {/* String lights wrapped around balloon */}
              <div className="absolute inset-0 rounded-t-full overflow-hidden opacity-80">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                  <path d="M 10,40 Q 50,70 90,40" fill="none" stroke="#ffd700" strokeWidth="0.8" />
                  <path d="M 20,60 Q 50,85 80,60" fill="none" stroke="#ffd700" strokeWidth="0.8" />
                  {/* tiny bulb glows */}
                  {[20, 35, 50, 65, 80].map((cx, i) => (
                    <circle key={i} cx={cx} cy={50 + Math.sin(cx) * 5} r="1.5" fill="#fff" filter="drop-shadow(0 0 2px #ffda1f)" />
                  ))}
                </svg>
              </div>
            </div>

            {/* Ropes linking balloon to basket */}
            <div className="flex justify-between w-14 h-6 px-1 relative -mt-0.5">
              <div className="w-[1.5px] h-full bg-white/40 origin-top rotate-[-12deg]" />
              <div className="w-[1.5px] h-full bg-white/40" />
              <div className="w-[1.5px] h-full bg-white/40 origin-top rotate-[12deg]" />
            </div>

            {/* Woven Basket with glowing neon heart and Teddy bear silhouette */}
            <div className="w-12 h-10 bg-amber-800 rounded-b-md border border-amber-950 flex flex-col items-center justify-center relative shadow-md">
              {/* Cute Teddy Bear inside */}
              <div className="absolute -top-4 w-6 h-5 flex flex-col items-center">
                <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center relative">
                  {/* ears */}
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full absolute -top-0.5 -left-0.5" />
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full absolute -top-0.5 -right-0.5" />
                  {/* nose */}
                  <div className="w-1 h-1 bg-black rounded-full absolute top-2" />
                </div>
              </div>
              {/* Glowing neon heart */}
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 drop-shadow-[0_0_8px_#ff4570] animate-pulse z-10 mt-2" />
            </div>
          </motion.div>

          {/* Symmetrical Polaroid 3 (Right top-right tilted) */}
          {BIRTHDAY_CONFIG.memoriesPhotos[1] && (
            <motion.div
              className="rotate-[6deg] self-end cursor-pointer hover:rotate-0 transition-transform duration-300"
              whileHover={{ scale: 1.05, zIndex: 40 }}
            >
              <div className="polaroid-frame w-48 shadow-2xl relative">
                <div className="absolute -top-3 right-10 w-16 h-5 bg-pink-300/20 backdrop-blur-sm rotate-3 border border-white/10" />
                <div className="polaroid-img-container rounded-sm">
                  <img
                    src={BIRTHDAY_CONFIG.memoriesPhotos[1].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-handwritten text-sm mt-2 text-center text-space-purple font-bold leading-tight">
                  Endless Love
                </p>
              </div>
            </motion.div>
          )}

          {/* Symmetrical Polaroid 4 (Right bottom-left tilted) */}
          {BIRTHDAY_CONFIG.memoriesPhotos[3] && (
            <motion.div
              className="rotate-[-8deg] self-start cursor-pointer hover:rotate-0 transition-transform duration-300 -mt-6"
              whileHover={{ scale: 1.05, zIndex: 40 }}
            >
              <div className="polaroid-frame w-48 shadow-2xl relative">
                <div className="absolute -top-3 left-10 w-16 h-5 bg-pink-300/20 backdrop-blur-sm -rotate-3 border border-white/10" />
                <div className="polaroid-img-container rounded-sm">
                  <img
                    src={BIRTHDAY_CONFIG.memoriesPhotos[3].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-handwritten text-sm mt-2 text-center text-space-purple font-bold leading-tight">
                  Always & Forever
                </p>
              </div>
            </motion.div>
          )}

          {/* Wrapped gifts at the bottom right */}
          <div className="relative mt-8 self-end mr-4 flex flex-col items-center">
            <div className="w-14 h-12 bg-gradient-to-tr from-pink-600 to-pink-400 rounded shadow-lg border border-pink-400/40 relative">
              {/* Ribbon */}
              <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gold-400 -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-2 bg-gold-400 -translate-y-1/2" />
              {/* Bow */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-3.5 bg-gold-400 rounded-full shadow border-b border-white/20" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── SCROLL DOWN INDICATOR ─── */}
      <motion.div
        className="pointer-events-auto cursor-pointer z-30 flex flex-col items-center gap-1.5 pb-2 select-none"
        onClick={handleScrollDown}
      >
        <div className="w-5 h-8 rounded-full border border-pink-300/30 flex items-start justify-center pt-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-pink-300"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-pink-300/70">
          Scroll To Begin
        </span>
      </motion.div>

      {/* ─── SYMMETRICAL BOTTOM DOCK / TAB BAR ─── */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="w-full max-w-5xl mx-auto px-6 pb-6 z-40 pointer-events-auto select-none"
      >
        <div className="glass-panel-heavy rounded-2xl border border-white/10 px-4 py-3 shadow-2xl grid grid-cols-6 gap-2 text-center">
          {[
            { label: "Our Story", icon: BookOpen, desc: "How we met", link: "#our-story" },
            { label: "Memories", icon: Camera, desc: "Special moments", link: "#memories" },
            { label: "Surprises", icon: Star, desc: "Just for you", link: "#surprises" },
            { label: "Reasons", icon: Heart, desc: "Why I love you", link: "#reasons" },
            { label: "Timeline", icon: Clock, desc: "Our journey", link: "#timeline" },
            { label: "Gallery", icon: Sparkles, desc: "Our photos", link: "#gallery" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.link}
                className="flex flex-col items-center gap-1 py-1.5 rounded-xl hover:bg-white/5 active:scale-95 transition-all duration-300 group border border-transparent hover:border-white/5"
              >
                <Icon className="w-5 h-5 text-pink-300 group-hover:scale-110 transition-transform duration-300 group-hover:text-pink-200" />
                <span className="text-[10px] uppercase font-sans font-bold text-cream-100 tracking-wide mt-1">
                  {item.label}
                </span>
                <span className="text-[8px] text-pink-300/60 font-sans group-hover:text-pink-300/80 transition-colors">
                  {item.desc}
                </span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
