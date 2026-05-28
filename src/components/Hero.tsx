import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { BIRTHDAY_CONFIG } from "../data/memories";
import { ChevronDown } from "lucide-react";

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Mouse coords for 3D parallax
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // 1. Text carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % BIRTHDAY_CONFIG.romanticPhrases.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // 2. Mouse move listener for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3. Three.js Starfield/Nebula Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    // Build Circular Glow Texture for particles
    const createCircleTexture = () => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(
          size / 2, size / 2, 0,
          size / 2, size / 2, size / 2
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.2, "rgba(255, 183, 197, 0.8)");
        grad.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      const tex = new THREE.CanvasTexture(c);
      return tex;
    };

    // Particles Geometry
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 300 : 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const pinkColor = new THREE.Color("#FFB7C5");
    const purpleColor = new THREE.Color("#8B5CF6");
    const goldColor = new THREE.Color("#FFD700");

    for (let i = 0; i < particleCount; i++) {
      // Coordinate placement in a 3D sphere
      const radius = Math.random() * 12 + 2;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 2;

      // Color interpolation
      const rand = Math.random();
      let chosenColor = pinkColor;
      if (rand > 0.65) chosenColor = purpleColor;
      else if (rand > 0.4) chosenColor = goldColor;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      // Particle sizes
      sizes[i] = Math.random() * 0.4 + 0.15;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Shader Material or Points Material
    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle lighting just in case
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop variables
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth mouse coordinate damping
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      // Camera motion: slow rotation + mouse follow parallax
      camera.position.x = Math.sin(elapsed * 0.05) * 2 + mouse.current.x * 1.5;
      camera.position.y = Math.cos(elapsed * 0.05) * 1 + mouse.current.y * 1.5;
      camera.lookAt(0, 0, 0);

      // Rotate particle cloud gently
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = elapsed * 0.008;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-cream-100 overflow-hidden py-12"
      id="hero-section"
    >
      {/* Background Aurora Gradient (Tailwind custom style) */}
      <div className="aurora-bg absolute inset-0 w-full h-full pointer-events-none" />

      {/* Three.js canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex-1 flex flex-col justify-center items-center gap-12 md:gap-16">
        
        {/* Floating polaroid images layout */}
        <div className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block overflow-hidden">
          
          {/* Polaroid 1 (Left floating) */}
          <motion.div
            initial={{ opacity: 0, x: -100, y: 100, rotate: -15 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: "8%", top: "25%" }}
            className="absolute pointer-events-auto"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08, rotate: -2, zIndex: 50 }}
              className="polaroid-frame hover-trigger shadow-2xl bg-cream-100 w-52 text-left"
            >
              <div className="polaroid-img-container">
                <img
                  src={BIRTHDAY_CONFIG.memoriesPhotos[0].url}
                  alt="Polaroid 1"
                  className="w-full h-full object-cover grayscale-[15%] contrast-[110%]"
                />
              </div>
              <p className="font-handwritten text-lg font-bold mt-3 leading-tight text-space-purple">
                {BIRTHDAY_CONFIG.memoriesPhotos[0].caption}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-pink-400 mt-2">
                {BIRTHDAY_CONFIG.memoriesPhotos[0].date}
              </p>
            </motion.div>
          </motion.div>

          {/* Polaroid 2 (Right floating) */}
          <motion.div
            initial={{ opacity: 0, x: 100, y: -50, rotate: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ right: "10%", top: "35%" }}
            className="absolute pointer-events-auto"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.08, rotate: 2, zIndex: 50 }}
              className="polaroid-frame hover-trigger shadow-2xl bg-cream-100 w-52 text-left"
            >
              <div className="polaroid-img-container">
                <img
                  src={BIRTHDAY_CONFIG.memoriesPhotos[1].url}
                  alt="Polaroid 2"
                  className="w-full h-full object-cover grayscale-[15%] contrast-[110%]"
                />
              </div>
              <p className="font-handwritten text-lg font-bold mt-3 leading-tight text-space-purple">
                {BIRTHDAY_CONFIG.memoriesPhotos[1].caption}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-pink-400 mt-2">
                {BIRTHDAY_CONFIG.memoriesPhotos[1].date}
              </p>
            </motion.div>
          </motion.div>

        </div>

        {/* Central Birthday Announcement */}
        <div className="text-center z-10 flex flex-col items-center select-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-pink-300 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase mb-4 text-glow-pink"
          >
            A Story Made in the Stars
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-cream-100 text-glow-pink"
          >
            Happy Birthday <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-gold-400 to-pink-300 bg-[length:200%_auto] animate-[pulse_6s_ease_infinite] block mt-2">
              {BIRTHDAY_CONFIG.partnerName} ❤️
            </span>
          </motion.h1>

          {/* Typewriter words Carousel */}
          <div className="h-12 mt-6 flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={carouselIndex}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="font-handwritten text-2xl sm:text-3xl md:text-4xl text-gold-400 font-bold"
              >
                {BIRTHDAY_CONFIG.romanticPhrases[carouselIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Mini view polaroids for mobile devices */}
        <div className="flex gap-4 lg:hidden z-10 mt-4 max-w-full overflow-x-auto py-4 px-2 no-scrollbar">
          <div className="polaroid-frame bg-cream-100 w-40 text-left shrink-0 shadow-lg -rotate-3 scale-95">
            <div className="polaroid-img-container">
              <img src={BIRTHDAY_CONFIG.memoriesPhotos[0].url} alt="Polaroid Mobile 1" className="w-full h-full object-cover" />
            </div>
            <p className="font-handwritten text-sm font-bold mt-2 leading-tight text-space-purple truncate">{BIRTHDAY_CONFIG.memoriesPhotos[0].caption}</p>
          </div>
          <div className="polaroid-frame bg-cream-100 w-40 text-left shrink-0 shadow-lg rotate-3 scale-95">
            <div className="polaroid-img-container">
              <img src={BIRTHDAY_CONFIG.memoriesPhotos[1].url} alt="Polaroid Mobile 2" className="w-full h-full object-cover" />
            </div>
            <p className="font-handwritten text-sm font-bold mt-2 leading-tight text-space-purple truncate">{BIRTHDAY_CONFIG.memoriesPhotos[1].caption}</p>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="relative z-10 flex flex-col items-center gap-1.5 cursor-none pointer-events-none"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-pink-300">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-pink-300 animate-bounce" />
      </motion.div>
    </div>
  );
};
