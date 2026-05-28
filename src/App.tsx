import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CustomCursor } from "./components/CustomCursor";
import { AudioEngine } from "./components/AudioEngine";
import { IntroLoader } from "./components/IntroLoader";
import { Hero } from "./components/Hero";
import { MemoriesGallery } from "./components/MemoriesGallery";
import { Timeline } from "./components/Timeline";
import { LoveCards } from "./components/LoveCards";
import { SecretLetter } from "./components/SecretLetter";
import { MemorySky } from "./components/MemorySky";
import { Countdown } from "./components/Countdown";
import { Ending } from "./components/Ending";

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);

  // Scroll Progress tracker for top indicator bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* 1. Immersive Intro Loader Screen */}
      {!hasEntered && <IntroLoader onEnter={() => setHasEntered(true)} />}

      {/* 2. Global Aesthetic Core Elements (Only visible after entering) */}
      {hasEntered && (
        <>
          {/* Custom Cursor System */}
          <CustomCursor />

          {/* Background Audio Engine Player */}
          <AudioEngine />

          {/* Film Grain Texture Overlay for a cozy nostalgic aesthetic */}
          <div className="film-grain" />

          {/* Sleek Top Neon Scroll Progress Indicator */}
          <motion.div
            style={{ scaleX }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-gold-400 to-pink-300 z-[99995] shadow-[0_2px_15px_rgba(255,183,197,0.4)] origin-left"
          />

          {/* 3. Main Storytelling Scrolling Journey */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-cosmic-black w-full"
          >
            {/* HERO SECTION - Cosmic Space & Floating Polaroids */}
            <Hero />

            {/* SECTION 1 - Our Memories Masonry Polaroid Lightbox Gallery */}
            <MemoriesGallery />

            {/* SECTION 2 - Relationship Timeline Constellation Path */}
            <Timeline />

            {/* SECTION 3 - Reasons Why I Love You 3D Flip Cards */}
            <LoveCards />

            {/* SECTION 4 - Secret Love Letter Envelope wax seal reveal */}
            <SecretLetter />

            {/* SECTION 5 - Interactive Starry Night Sky Constellations */}
            <MemorySky />

            {/* SECTION 6 - Birthday Countdown Wishes & Firework blasts */}
            <Countdown />

            {/* FINAL SECTION - Emotional Conclusion & Drifting fragments */}
            <Ending />
          </motion.main>
        </>
      )}
    </>
  );
};

export default App;
