import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Stars, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { useAudioStore } from "../store";
import { BIRTHDAY_CONFIG } from "../data/memories";

export const Scene3D: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const getAudioIntensity = useAudioStore(state => state.getAudioIntensity);

  useFrame(() => {
    // Scroll progress is between 0 and 1
    const offset = scroll.offset;

    // Cinematic Camera Motion
    // As user scrolls, camera flies forward through Z space
    if (cameraGroupRef.current) {
      // Pushing camera forward in Z space based on scroll
      // The total scroll length represents a journey of say, 50 units
      cameraGroupRef.current.position.z = THREE.MathUtils.lerp(
        cameraGroupRef.current.position.z,
        -offset * 40,
        0.05
      );

      // Subtle rotation for cinematic pan effect
      cameraGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.y,
        Math.sin(offset * Math.PI * 4) * 0.1,
        0.05
      );
    }

    // Audio Reactivity
    const intensity = getAudioIntensity();
    if (groupRef.current) {
      // Pulse scale slightly with bass/music
      const targetScale = 1 + intensity * 0.2;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#FFB7C5" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#1E1035" />

      <group ref={groupRef}>
        {/* Galaxy Environment */}
        <Stars 
          radius={100} 
          depth={150} 
          count={5000} 
          factor={5} 
          saturation={0.8} 
          fade 
          speed={1.5} 
        />
        
        {/* Memory floating nodes (Polaroids in 3D space) */}
        {BIRTHDAY_CONFIG.memoriesPhotos.map((photo, i) => (
          <Float 
            key={`photo-${i}`} 
            speed={1 + Math.random()} 
            rotationIntensity={0.5} 
            floatIntensity={1.5} 
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 10,
              // Distribute photos along the Z-axis of the scroll journey (-10 to -35)
              -(10 + Math.random() * 25) 
            ]}
          >
            <Html transform distanceFactor={5} sprite={false} zIndexRange={[100, 0]}>
              <div 
                className="polaroid-frame bg-cream-100 shadow-2xl hover-trigger select-none"
                style={{ width: "240px", padding: "12px 12px 30px 12px", pointerEvents: "auto" }}
                data-cursor="VIEW"
                onClick={() => console.log('Opened full screen memory', photo.id)}
              >
                <div className="polaroid-img-container" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
                <p className="font-handwritten text-xl font-bold mt-4 leading-tight text-space-purple text-center">
                  {photo.caption}
                </p>
                <p className="font-sans text-[10px] uppercase tracking-widest text-pink-400 mt-2 text-center">
                  {photo.date}
                </p>
              </div>
            </Html>
          </Float>
        ))}

        {/* Constellation Timeline Nodes */}
        {BIRTHDAY_CONFIG.timelineEvents.map((event, i) => (
          <Float
            key={`timeline-${i}`}
            speed={2}
            rotationIntensity={2}
            floatIntensity={2}
            position={[
              (i % 2 === 0 ? 1 : -1) * (4 + Math.random() * 4), // alternate left/right
              (Math.random() - 0.5) * 6,
              // Distribute further down Z axis (-40 to -70)
              -(40 + i * 5)
            ]}
          >
            {/* The glowing planet/star */}
            <mesh>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial 
                color="#8B5CF6" 
                emissive="#a78bfa" 
                emissiveIntensity={2} 
                toneMapped={false} 
              />
            </mesh>
            
            <Html transform distanceFactor={8} position={[0, -1, 0]}>
              <div 
                className="text-center pointer-events-auto hover-trigger p-4 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-xl w-64 shadow-[0_0_30px_rgba(167,139,250,0.2)] hover:shadow-[0_0_50px_rgba(167,139,250,0.6)] transition-all cursor-pointer"
                data-cursor="OPEN"
              >
                <span className="text-pink-300 text-xs font-bold tracking-widest uppercase">{event.date}</span>
                <h3 className="text-xl font-serif text-white font-bold mt-1 mb-2">{event.title}</h3>
                <p className="text-sm text-cream-100/80">{event.description}</p>
              </div>
            </Html>
          </Float>
        ))}
      </group>
    </group>
  );
};
