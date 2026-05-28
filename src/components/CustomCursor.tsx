import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  isHeart: boolean;
  angle: number;
  spin: number;
}

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Detect mobile
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (isMobile) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    setIsVisible(true);
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Emit movement stardust particles
      if (Math.random() < 0.25) {
        createParticle(e.clientX, e.clientY, false);
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      // Emit click burst particles
      for (let i = 0; i < 15; i++) {
        createParticle(mousePos.current.x, mousePos.current.y, true);
      }
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Detect hoverable items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    // Canvas particle system logic
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticle = (x: number, y: number, isClickBurst: boolean) => {
      const colors = ["#FFB7C5", "#E0A3B1", "#FFD700", "#FAF7F2", "#8B5CF6"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = isClickBurst ? Math.random() * 3 + 1.5 : Math.random() * 0.8 + 0.2;
      
      const p: Particle = {
        x,
        y,
        vx: Math.cos(angle) * speed + (isClickBurst ? 0 : (Math.random() - 0.5) * 0.5),
        vy: Math.sin(angle) * speed - (isClickBurst ? 1 : 0.8), // float upwards
        size: Math.random() * 4 + 2,
        alpha: 1,
        color: randomColor,
        isHeart: Math.random() < 0.25, // 25% chance of spawning floating hearts
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05
      };
      
      particles.current.push(p);
      if (particles.current.length > 100) {
        particles.current.shift();
      }
    };

    // Animation Loop
    let animationFrameId: number;
    
    const updateCursorAndParticles = () => {
      // 1. Move Ring with Momentum (Lerp)
      const ringSpeed = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ringSpeed;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ringSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0px) scale(${isHovered ? 1.5 : 1})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0px)`;
      }

      // 2. Render Particles on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeParticles = particles.current;

      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.012; // slow fade
        p.size *= 0.98;   // shrink over time
        p.angle += p.spin;

        if (p.alpha <= 0 || p.size <= 0.5) {
          activeParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.isHeart) {
          // Draw a small heart
          ctx.beginPath();
          const d = p.size;
          ctx.moveTo(0, -d / 2);
          ctx.bezierCurveTo(d / 2, -d, d, -d / 3, 0, d);
          ctx.bezierCurveTo(-d, -d / 3, -d / 2, -d, 0, -d / 2);
          ctx.fill();
        } else {
          // Draw a four-point star sparkle
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateCursorAndParticles);
    };

    updateCursorAndParticles();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99999]"
      />

      {/* Main Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-pink-300 pointer-events-none -ml-4 -mt-4 transition-all duration-300 z-[99999] will-change-transform mix-blend-screen flex items-center justify-center shadow-[0_0_10px_rgba(255,183,197,0.3)] ${
          isHovered
            ? "bg-pink-300/10 border-pink-400 border-2 w-12 h-12 -ml-6 -mt-6 shadow-[0_0_20px_rgba(255,183,197,0.5)]"
            : ""
        } ${isClicked ? "scale-90 border-gold-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]" : ""}`}
      />

      {/* Central Solid Pointer Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-pink-300 pointer-events-none -ml-[3px] -mt-[3px] z-[99999] will-change-transform shadow-[0_0_8px_rgba(255,183,197,0.9)] ${
          isHovered ? "bg-gold-400 scale-[2.5] shadow-[0_0_12px_rgba(255,215,0,0.9)]" : ""
        }`}
      />
    </>
  );
};
