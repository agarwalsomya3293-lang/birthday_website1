import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface IntroLoaderProps {
  onEnter: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [typedText, setTypedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const fullText = "A little universe made only for you...";

  // 1. Starry background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Star definitions
    const isMobile = window.innerWidth < 768;
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      alpha: number;
      direction: number;
    }> = Array.from({ length: isMobile ? 40 : 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.05 + 0.02,
      alpha: Math.random() * 0.5 + 0.2,
      direction: Math.random() * Math.PI * 2
    }));

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle dark-purple glow in center
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      gradient.addColorStop(0, "rgba(30, 16, 53, 0.4)");
      gradient.addColorStop(1, "rgba(5, 5, 8, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render stars
      ctx.fillStyle = "#FAF7F2";
      stars.forEach((star) => {
        // Star movement
        star.x += Math.cos(star.direction) * star.speed;
        star.y += Math.sin(star.direction) * star.speed;

        // Wrap around edge
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle effect (alpha oscillation)
        star.alpha += (Math.random() - 0.5) * 0.03;
        star.alpha = Math.max(0.1, Math.min(0.8, star.alpha));

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.shadowColor = "#FFB7C5";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    drawStars();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Typewriter Effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        // Delay revealing the luxury start button
        setTimeout(() => setShowButton(true), 800);
      }
    }, 90); // Delicate typist speed

    return () => clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    
    // Broadcast music trigger event
    const startAudioEvent = new CustomEvent("play-love-music");
    window.dispatchEvent(startAudioEvent);

    // Complete loader fadeout transition
    setTimeout(() => {
      onEnter();
    }, 1500); // 1.5s fade out
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 w-full h-full bg-cosmic-black z-[99999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Drifting Stars Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, rgba(5,5,8,0.9) 100%) pointer-events-none" />

          {/* Immersive Text & Button Content */}
          <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center select-none">
            {/* Typewriter message */}
            <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-wide text-cream-100 text-glow-pink h-16 flex items-center justify-center">
              <span>{typedText}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-0.5 h-6 ml-1 bg-pink-300"
              />
            </h1>

            {/* Luxurious enter button */}
            <div className="h-20 mt-8 flex items-center justify-center">
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={handleEnterClick}
                  className="group relative px-8 py-3.5 rounded-full glass-panel border border-pink-300/30 text-cream-100 hover:text-white text-sm font-semibold tracking-wider hover-trigger transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,183,197,0.1)] hover:shadow-[0_0_30px_rgba(255,183,197,0.35)] flex items-center gap-2 cursor-none"
                >
                  {/* Subtle inner background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-500/10 to-gold-400/10 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-500" />
                  
                  <Sparkles className="w-4 h-4 text-pink-300 group-hover:animate-pulse" />
                  <span>ENTER HER UNIVERSE</span>
                  <Sparkles className="w-4 h-4 text-gold-400 group-hover:animate-pulse" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
