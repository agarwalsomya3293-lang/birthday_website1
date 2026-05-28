import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { CustomCursor } from "./components/CustomCursor";
import { AudioEngine } from "./components/AudioEngine";
import { IntroLoader } from "./components/IntroLoader";
import { Scene3D } from "./components/Scene3D";
import { HtmlOverlay } from "./components/HtmlOverlay";
import { InteractiveGifts } from "./components/InteractiveGifts";

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      {!hasEntered && <IntroLoader onEnter={() => setHasEntered(true)} />}

      {hasEntered && (
        <div className="w-full h-screen bg-cosmic-black overflow-hidden relative">
          <CustomCursor />
          <AudioEngine />
          <InteractiveGifts />
          
          <div className="film-grain" />

          {/* WebGL 3D Canvas rendering the cinematic background journey */}
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false }}
            className="absolute inset-0 z-0"
          >
            <color attach="background" args={['#050508']} />
            <Suspense fallback={null}>
              <ScrollControls pages={8} damping={0.25} distance={1.5}>
                {/* 3D World Scene */}
                <Scene3D />
                
                {/* HTML DOM Content overlayed and scroll-synced */}
                <Scroll html style={{ width: '100%', height: '100%' }}>
                  <HtmlOverlay />
                </Scroll>
              </ScrollControls>
            </Suspense>
          </Canvas>
        </div>
      )}
    </>
  );
};

export default App;
