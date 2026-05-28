import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BIRTHDAY_CONFIG } from "../data/memories";
import { Heart, X } from "lucide-react";

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "heart" | "balloon" | "lantern";
  color: string;
}

export const MemoriesGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof BIRTHDAY_CONFIG.memoriesPhotos[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const layerX = useTransform(parallaxX, (v: number) => v * 15);
  const layerY = useTransform(parallaxY, (v: number) => v * 15);

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

  // Precompute floating elements for background depth
  const ambientItems = useMemo<FloatingItem[]>(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      size: Math.random() * 16 + 8,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 12,
      type: Math.random() > 0.65 ? "heart" : Math.random() > 0.35 ? "balloon" : "lantern",
      color: ["rgba(255,105,180,0.4)", "rgba(167,139,250,0.35)", "rgba(255,215,0,0.3)"][i % 3],
    }));
  }, []);

  // Hardcoded visual captions matching the image precisely
  const visualCaptions = [
    "Our First Sunset",
    "You & Me",
    "Magical Evenings",
    "Little Moments",
    "My Forever",
    "Memories Like These"
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-cosmic-black py-16 px-6"
      id="memories-section"
    >
      {/* ─── ATMOSPHERE BACKGROUND (Breathing gradients & stars) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#12041e] via-[#240b36] to-[#0a0518] opacity-95" />
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-pink-500/10 to-transparent" />
        
        {/* Soft glowing purple aurora blobs */}
        <motion.div
          className="absolute w-[70vw] h-[70vw] rounded-full blur-[130px] opacity-20"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 75%)", top: "20%", left: "15%" }}
          animate={{ scale: [1, 1.15, 1], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ─── BACKGROUND FLOATING ITEMS ─── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {ambientItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            animate={{
              y: ["0vh", "-110vh"],
              x: ["0px", `${Math.sin(item.id) * 30}px`],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {item.type === "heart" && (
              <Heart className="text-pink-300/30 fill-pink-300/10" style={{ width: item.size, height: item.size }} />
            )}
            {item.type === "balloon" && (
              <div
                className="rounded-full border border-white/20"
                style={{
                  width: item.size * 1.5,
                  height: item.size * 1.5,
                  background: `radial-gradient(circle at 35% 35%, rgba(255, 182, 193, 0.4) 0%, rgba(216, 180, 254, 0.1) 70%)`,
                  filter: "drop-shadow(0 0 8px rgba(255,192,203,0.3))",
                }}
              />
            )}
            {item.type === "lantern" && (
              <div
                style={{
                  width: item.size * 0.9,
                  height: item.size * 1.2,
                  background: "radial-gradient(circle at center, #ffd275 30%, #e06010 80%)",
                  borderRadius: "3px 3px 1.5px 1.5px",
                  filter: "drop-shadow(0 0 8px rgba(224,96,16,0.6))",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* ─── HEADER / CHAPTER TITLES ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="text-center z-20 select-none pointer-events-none mt-4"
      >
        <span className="font-sans text-[11px] tracking-[0.45em] uppercase text-pink-300 drop-shadow-[0_0_8px_rgba(255,183,197,0.6)]">
          Chapter 1
        </span>
        <h2
          className="font-serif text-5xl md:text-7xl font-bold mt-2 text-cream-100 leading-none tracking-normal"
          style={{ textShadow: "0 0 35px rgba(255,183,197,0.25)" }}
        >
          Drifting Memories
        </h2>
        <p className="font-handwritten text-lg sm:text-xl text-pink-200/80 mt-4 italic font-semibold tracking-wide">
          Fragments of moments that became forever.
        </p>

        {/* Cursive divider symbol */}
        <div className="flex items-center justify-center mt-3 text-pink-400 opacity-60">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-pink-400/50" />
          <Heart className="w-3.5 h-3.5 mx-2 fill-pink-400/20" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-pink-400/50" />
        </div>
      </motion.div>

      {/* ─── MAIN CONTENT: PARALLAX HANGING WIRE & POLAROIDS ─── */}
      <motion.div
        className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center my-auto z-20"
        style={{ x: layerX, y: layerY }}
      >
        {/* Curved String path decorated with fairy lights */}
        <div className="absolute top-[20px] left-0 right-0 h-[80px] pointer-events-none z-10 overflow-visible">
          <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="overflow-visible">
            {/* Main Cable */}
            <path
              d="M 10,20 Q 500,100 990,20"
              fill="none"
              stroke="rgba(255, 215, 0, 0.25)"
              strokeWidth="1.5"
            />
            {/* Clothespin clips placement guides */}
            {[75, 240, 410, 580, 755, 920].map((cx, i) => {
              // Mathematical Q curve projection for Y position
              const t = cx / 1000;
              const cy = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 100 + t * t * 20 - 5;
              return (
                <g key={i}>
                  {/* Glowing bulb light right next to each clip */}
                  <circle
                    cx={cx}
                    cy={cy + 8}
                    r="4"
                    fill="#ffeaab"
                    className="animate-pulse"
                    style={{
                      animationDuration: `${1.5 + i * 0.2}s`,
                      filter: "drop-shadow(0 0 8px #ffd700)",
                    }}
                  />
                  {/* Decorative Light line drop */}
                  <line x1={cx} y1={cy} x2={cx} y2={cy + 8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Symmetrical Polaroid memories grid (arranged along the hanging coordinates) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 pt-12 px-4 pointer-events-auto">
          {BIRTHDAY_CONFIG.memoriesPhotos.slice(0, 6).map((photo, index) => {
            // Hanging animation rotation sway factors
            const swayRotation = index % 2 === 0 ? [-3, 3, -3] : [3, -3, 3];
            const caption = visualCaptions[index] || photo.caption;

            return (
              <motion.div
                key={photo.id}
                className="flex flex-col items-center select-none"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: index * 0.15 }}
              >
                {/* Simulated Clothespin clip */}
                <div className="w-2.5 h-7 bg-amber-200/90 border border-amber-900/30 rounded-t-sm shadow-md z-30 -mb-2 relative" />

                {/* Polaroid Frame Container */}
                <motion.div
                  className="polaroid-frame w-full max-w-[170px] shadow-2xl cursor-pointer relative"
                  animate={{ rotate: swayRotation }}
                  transition={{
                    duration: 5 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: 0,
                    zIndex: 50,
                    boxShadow: "0 25px 50px rgba(255,182,193,0.3)",
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="polaroid-img-container rounded-sm">
                    <img
                      src={photo.url}
                      alt={caption}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </div>
                  {/* Heart dot icon before caption */}
                  <p className="font-handwritten text-[13px] md:text-sm mt-2 text-center text-space-purple font-extrabold leading-tight px-1 flex flex-col items-center">
                    <span>{caption}</span>
                    <span className="text-[9px] text-pink-500/80 mt-0.5">♥</span>
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── BOTTOM DECORATION: Glowing Gift Boxes nestled in Flower clouds ─── */}
      <div className="w-full max-w-7xl mx-auto px-6 relative pointer-events-none z-30 flex justify-between items-end mt-8">
        
        {/* Left Gift Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative flex flex-col items-center"
        >
          {/* Glowing Pink Flowers behind */}
          <div className="absolute inset-x-[-20px] bottom-[-10px] h-16 bg-[#ff6482]/15 blur-xl rounded-full" />
          <div className="w-16 h-14 bg-gradient-to-tr from-pink-600 to-pink-400 rounded-lg shadow-lg relative border border-white/20">
            {/* Ribbons */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gold-400 -translate-x-1/2" />
            <div className="absolute left-0 right-0 top-1/2 h-1.5 bg-gold-400 -translate-y-1/2" />
            {/* Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-4 bg-gold-400 rounded-full shadow border-b border-white/25" />
          </div>
        </motion.div>

        {/* Scroll down indicator */}
        <div className="flex flex-col items-center gap-1.5 pb-2">
          <div className="w-4.5 h-7.5 rounded-full border border-pink-300/30 flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-pink-300"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-pink-300/60">
            Scroll To Explore
          </span>
        </div>

        {/* Right Gift Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="relative flex flex-col items-center"
        >
          <div className="absolute inset-x-[-20px] bottom-[-10px] h-16 bg-gold-400/10 blur-xl rounded-full" />
          <div className="w-16 h-14 bg-gradient-to-tr from-gold-500 to-gold-400 rounded-lg shadow-lg relative border border-white/20">
            {/* Ribbons */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-pink-500 -translate-x-1/2" />
            <div className="absolute left-0 right-0 top-1/2 h-1.5 bg-pink-500 -translate-y-1/2" />
            {/* Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-4 bg-pink-500 rounded-full shadow border-b border-white/25" />
          </div>
        </motion.div>
      </div>

      {/* ─── FULLSCREEN VIEWING MODAL (Creative Pop-up Details) ─── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 pointer-events-auto select-none"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close button */}
            <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="polaroid-frame max-w-md w-full bg-cream-100 p-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="polaroid-img-container rounded overflow-hidden aspect-[4/3] bg-black">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  {selectedPhoto.date}
                </span>
                <p className="font-handwritten text-2xl font-bold mt-2 text-space-purple leading-tight px-1">
                  {selectedPhoto.caption}
                </p>
                <div className="flex justify-center gap-1 mt-4">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
