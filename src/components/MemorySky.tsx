import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, X } from "lucide-react";
import { BIRTHDAY_CONFIG, type ConstellationStar } from "../data/memories";

interface BackdropStar {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  alpha: number;
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  life: number;
  maxLife: number;
}

export const MemorySky: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);
  const [hoveredStar, setHoveredStar] = useState<ConstellationStar | null>(null);

  const starsData = BIRTHDAY_CONFIG.constellationStars;

  // Track cursor position for canvas particle interactions
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (canvas && containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // 1. Generate Backdrop Twinkling Stars
    const isMobile = window.innerWidth < 768;
    const backdropStars: BackdropStar[] = Array.from({ length: isMobile ? 50 : 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      alpha: Math.random()
    }));

    // 2. Shooting Stars list
    let shootingStars: ShootingStar[] = [];

    const triggerShootingStar = () => {
      if (Math.random() < 0.2 && shootingStars.length < 2) {
        const startX = Math.random() * canvas.width * 0.7;
        const startY = Math.random() * canvas.height * 0.4;
        const speed = Math.random() * 5 + 5;
        const angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // Sweep down-right
        
        shootingStars.push({
          x: startX,
          y: startY,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          length: Math.random() * 80 + 40,
          life: 0,
          maxLife: Math.random() * 30 + 20
        });
      }
    };

    const drawSky = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw backdrop gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "#050508");
      gradient.addColorStop(0.5, "#100926");
      gradient.addColorStop(1, "#050508");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Render Backdrop Stars
      backdropStars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.fillStyle = "#FAF7F2";
        ctx.shadowColor = "#FFB7C5";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Trigger & Render Shooting Stars
      triggerShootingStar();
      shootingStars.forEach((star, index) => {
        star.x += star.dx;
        star.y += star.dy;
        star.life++;

        if (star.life >= star.maxLife) {
          shootingStars.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#FFB7C5";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.dx * 1.5, star.y - star.dy * 1.5);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Connect Constellation Nodes together
      ctx.save();
      ctx.strokeStyle = "rgba(255, 215, 0, 0.15)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(255, 215, 0, 0.4)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      
      starsData.forEach((star, idx) => {
        const starX = (star.x / 100) * w;
        const starY = (star.y / 100) * h;
        if (idx === 0) {
          ctx.moveTo(starX, starY);
        } else {
          ctx.lineTo(starX, starY);
        }
      });
      // Close constellation loop
      if (starsData.length > 0) {
        ctx.lineTo((starsData[0].x / 100) * w, (starsData[0].y / 100) * h);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Subtle line to mouse cursor
      starsData.forEach((star) => {
        const starX = (star.x / 100) * w;
        const starY = (star.y / 100) * h;
        const dist = Math.hypot(mousePos.current.x - starX, mousePos.current.y - starY);
        
        if (dist < 180) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 183, 197, ${0.25 * (1 - dist / 180)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(starX, starY);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.stroke();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(drawSky);
    };

    drawSky();

    const handleMouseMove = (e: MouseEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePos.current.x = e.clientX - rect.left;
        mousePos.current.y = e.clientY - rect.top;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [starsData]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[650px] md:min-h-[750px] w-full flex flex-col justify-center items-center py-20 px-6 overflow-hidden select-none" 
      id="sky-section"
    >
      {/* Absolute canvas drawing layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center flex-1">
        
        {/* Header Text */}
        <div className="text-center mb-12 select-none pointer-events-none">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold-400 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-glow-gold"
          >
            Chapter V
          </motion.span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mt-3 text-glow-pink">
            Interactive Memory Sky
          </h2>
          <p className="font-sans text-xs tracking-widest text-pink-300/60 mt-3 uppercase">
            Click on the brightest glowing stars to navigate our shared universe
          </p>
        </div>

        {/* Constellation Star Buttons Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {starsData.map((star) => {
            const isHovered = hoveredStar?.id === star.id;
            const isSelected = selectedStar?.id === star.id;

            return (
              <div
                key={star.id}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group"
              >
                {/* Glowing Core Star Button */}
                <button
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => setSelectedStar(star)}
                  className="relative p-3 rounded-full hover:scale-125 transition-transform duration-300 focus:outline-none hover-trigger"
                >
                  {/* Glowing halo indicator */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.4, 1], 
                      opacity: isHovered || isSelected ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inset-0 rounded-full blur-[4px] border ${
                      isSelected 
                        ? "bg-gold-400/20 border-gold-400 shadow-[0_0_15px_#FFD700]" 
                        : "bg-pink-300/10 border-pink-300 shadow-[0_0_10px_rgba(255,183,197,0.4)]"
                    }`}
                  />
                  
                  {/* Central Star Icon */}
                  <Star 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isSelected ? "text-gold-400 fill-gold-400" : "text-pink-300 group-hover:text-gold-400 group-hover:fill-gold-400"
                    }`} 
                  />
                </button>

                {/* Floating title below the star */}
                <div 
                  className={`mt-2 px-3 py-1 rounded glass-panel border border-white/5 font-sans text-[10px] uppercase font-bold tracking-widest text-cream-100 pointer-events-none transition-all duration-300 ${
                    isHovered || isSelected ? "opacity-100 scale-100 translate-y-0" : "opacity-40 scale-95 -translate-y-1"
                  }`}
                >
                  {star.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dreamy glassmorphic modal pop-up capsule */}
        <AnimatePresence>
          {selectedStar && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="absolute bottom-6 md:bottom-12 max-w-lg w-full glass-panel-heavy border border-pink-300/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-[0_20px_50px_rgba(255,183,197,0.15)] z-40"
            >
              {/* Polaroid Image inside POPUP */}
              {selectedStar.photoUrl && (
                <div className="polaroid-frame bg-cream-100 w-full sm:w-36 shrink-0 shadow-lg text-left -rotate-2">
                  <div className="polaroid-img-container">
                    <img 
                      src={selectedStar.photoUrl} 
                      alt="Constellation memory" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-sans text-[7px] uppercase tracking-[0.2em] text-pink-400 mt-2 block leading-none font-bold">
                    Constellation Memory
                  </span>
                </div>
              )}

              {/* Message Details */}
              <div className="flex-1 flex flex-col justify-between text-left select-none">
                <div>
                  <div className="flex justify-between items-start border-b border-pink-300/10 pb-2 mb-3">
                    <h3 className="font-serif text-xl font-bold text-cream-100 text-glow-pink">
                      {selectedStar.title}
                    </h3>
                    <button
                      onClick={() => setSelectedStar(null)}
                      className="p-1 rounded hover:bg-white/5 text-cream-100/60 hover:text-cream-100 transition-colors hover-trigger"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="font-handwritten text-lg leading-relaxed text-cream-100/90 font-semibold mb-4">
                    "{selectedStar.message}"
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-gold-400 font-sans text-[9px] uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Written in our stars</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
