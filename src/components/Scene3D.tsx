import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Stars, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { useAudioStore } from "../store";
import { BIRTHDAY_CONFIG } from "../data/memories";

/* ──────────────────────────────────────────────
   Glowing Orb – a simple emissive sphere with
   a soft halo, used for constellation nodes
   ────────────────────────────────────────────── */
const GlowOrb: React.FC<{
  position: [number, number, number];
  color: string;
  emissive: string;
  size?: number;
}> = ({ position, color, emissive, size = 0.2 }) => (
  <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
    <mesh position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={3}
        toneMapped={false}
      />
    </mesh>
    {/* Soft halo */}
    <mesh position={position}>
      <sphereGeometry args={[size * 3, 16, 16]} />
      <meshBasicMaterial
        color={emissive}
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </mesh>
  </Float>
);

/* ──────────────────────────────────────────────
   MAIN 3D SCENE
   ────────────────────────────────────────────── */
export const Scene3D: React.FC = () => {
  const scroll = useScroll();
  const worldRef = useRef<THREE.Group>(null);
  const cameraRigRef = useRef<THREE.Group>(null);
  const getAudioIntensity = useAudioStore((s) => s.getAudioIntensity);

  // HTML element refs to control opacity dynamically
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pre-compute stable random positions
  const photoPositions = useMemo(() =>
    BIRTHDAY_CONFIG.memoriesPhotos.map((_, i) => {
      const angle = (i / BIRTHDAY_CONFIG.memoriesPhotos.length) * Math.PI * 2;
      const radius = 6 + (i % 3) * 2;
      return [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        -(15 + i * 5), // Spread deeper into the scene, AWAY from hero
      ] as [number, number, number];
    }),
  []);

  const timelinePositions = useMemo(() =>
    BIRTHDAY_CONFIG.timelineEvents.map((_, i) => [
      (i % 2 === 0 ? 1 : -1) * (5 + (i % 3)),
      (Math.random() - 0.5) * 3,
      -(50 + i * 6),
    ] as [number, number, number]),
  []);

  // Ambient orbs scattered decoratively
  const ambientOrbs = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        -Math.random() * 80,
      ] as [number, number, number],
      color: ["#FFB7C5", "#8B5CF6", "#FFD700"][i % 3],
      emissive: ["#FFB7C5", "#a78bfa", "#FFD700"][i % 3],
      size: 0.08 + Math.random() * 0.15,
    })),
  []);

  useFrame(() => {
    const offset = scroll.offset;

    if (cameraRigRef.current) {
      // Smooth camera Z push – the entire journey depth
      cameraRigRef.current.position.z = THREE.MathUtils.lerp(
        cameraRigRef.current.position.z,
        -offset * 50,
        0.04
      );

      // Very gentle cinematic sway
      cameraRigRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraRigRef.current.rotation.y,
        Math.sin(offset * Math.PI * 3) * 0.06,
        0.03
      );
      cameraRigRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraRigRef.current.rotation.x,
        Math.cos(offset * Math.PI * 2) * 0.02,
        0.03
      );
    }

    // Audio reactivity – subtle world pulse
    const intensity = getAudioIntensity();
    if (worldRef.current) {
      const s = 1 + intensity * 0.12;
      worldRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08);
    }

    // Calculate opacities
    const photoOpacity = offset < 0.08 ? 0 : Math.min(1, (offset - 0.08) * 10);
    const timelineOpacity = offset < 0.22 ? 0 : Math.min(1, (offset - 0.22) * 10);

    // Update DOM opacities directly (prevents heavy React re-renders)
    photoRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.opacity = photoOpacity.toString();
        ref.style.pointerEvents = photoOpacity > 0.1 ? "auto" : "none";
        ref.style.display = photoOpacity === 0 ? "none" : "block";
      }
    });

    timelineRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.opacity = timelineOpacity.toString();
        ref.style.pointerEvents = timelineOpacity > 0.1 ? "auto" : "none";
        ref.style.display = timelineOpacity === 0 ? "none" : "block";
      }
    });
  });

  return (
    <group ref={cameraRigRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 6, 5]} intensity={0.8} color="#FFB7C5" />
      <directionalLight position={[-8, -4, -5]} intensity={0.3} color="#1E1035" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#8B5CF6" distance={20} />

      <group ref={worldRef}>
        {/* ─── Galaxy Star Field ─── */}
        <Stars
          radius={120}
          depth={200}
          count={4000}
          factor={4}
          saturation={0.6}
          fade
          speed={0.8}
        />

        {/* ─── Ambient Decorative Orbs ─── */}
        {ambientOrbs.map((orb, i) => (
          <GlowOrb key={`orb-${i}`} {...orb} />
        ))}

        {/* ─── Floating Memory Polaroids ─── */}
        {BIRTHDAY_CONFIG.memoriesPhotos.map((photo, i) => (
          <Float
            key={`photo-${i}`}
            speed={0.8 + (i % 3) * 0.3}
            rotationIntensity={0.3}
            floatIntensity={1}
            position={photoPositions[i]}
          >
            <Html
              transform
              distanceFactor={6}
              sprite={false}
              zIndexRange={[100, 0]}
            >
              <div
                ref={(el) => { photoRefs.current[i] = el; }}
                className="polaroid-frame bg-cream-100 shadow-2xl hover-trigger select-none transition-transform duration-500 hover:scale-105"
                style={{ width: "220px", padding: "10px 10px 28px 10px", pointerEvents: "auto", display: "none", opacity: 0 }}
                data-cursor="VIEW"
              >
                <div className="polaroid-img-container" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <p className="font-handwritten text-lg font-bold mt-3 leading-tight text-space-purple text-center">
                  {photo.caption}
                </p>
                <p className="font-sans text-[9px] uppercase tracking-widest text-pink-400 mt-1.5 text-center">
                  {photo.date}
                </p>
              </div>
            </Html>
          </Float>
        ))}

        {/* ─── Constellation Timeline Nodes ─── */}
        {BIRTHDAY_CONFIG.timelineEvents.map((event, i) => (
          <Float
            key={`timeline-${i}`}
            speed={1.2}
            rotationIntensity={0.5}
            floatIntensity={1.5}
            position={timelinePositions[i]}
          >
            {/* Glowing planet */}
            <mesh>
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial
                color="#8B5CF6"
                emissive="#a78bfa"
                emissiveIntensity={2.5}
                toneMapped={false}
              />
            </mesh>
            {/* Planet halo */}
            <mesh>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshBasicMaterial
                color="#a78bfa"
                transparent
                opacity={0.03}
                depthWrite={false}
              />
            </mesh>

            <Html transform distanceFactor={8} position={[0, -1.2, 0]}>
              <div
                ref={(el) => { timelineRefs.current[i] = el; }}
                className="text-center pointer-events-auto hover-trigger p-5 bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl w-72 shadow-[0_0_40px_rgba(167,139,250,0.15)] hover:shadow-[0_0_60px_rgba(167,139,250,0.4)] transition-all duration-500"
                style={{ display: "none", opacity: 0 }}
                data-cursor="OPEN"
              >
                <span className="text-pink-300/80 text-[10px] font-bold tracking-[0.3em] uppercase">
                  {event.date}
                </span>
                <h3 className="text-xl font-serif text-white font-bold mt-2 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-cream-100/60 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </Html>
          </Float>
        ))}
      </group>
    </group>
  );
};
