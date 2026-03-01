import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function WatchModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.2}>
        {/* Watch case - main body */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.35, 64]} />
          <meshStandardMaterial
            color="#2a2a30"
            metalness={0.95}
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Watch case - bezel ring */}
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[1.05, 0.06, 16, 64]} />
          <meshStandardMaterial
            color="#c0c0cc"
            metalness={1}
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <torusGeometry args={[1.05, 0.06, 16, 64]} />
          <meshStandardMaterial
            color="#c0c0cc"
            metalness={1}
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>

        {/* Watch dial / face */}
        <mesh position={[0, 0.181, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.95, 64]} />
          <meshStandardMaterial
            color="#0a0a12"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 0.78;
          const isMain = i % 3 === 0;
          return (
            <mesh
              key={i}
              position={[
                Math.sin(angle) * r,
                0.185,
                Math.cos(angle) * r,
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <boxGeometry args={[isMain ? 0.06 : 0.03, isMain ? 0.14 : 0.08, 0.01]} />
              <meshStandardMaterial
                color="#e0e0e8"
                metalness={0.9}
                roughness={0.1}
                emissive="#505060"
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}

        {/* Hour hand */}
        <mesh position={[0, 0.19, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.04, 0.4, 0.015]} />
          <meshStandardMaterial color="#e0e0e8" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Minute hand */}
        <mesh position={[0.15, 0.19, -0.15]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <boxGeometry args={[0.025, 0.55, 0.01]} />
          <meshStandardMaterial color="#e0e0e8" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Center pin */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.05} />
        </mesh>

        {/* Crown (winding knob) */}
        <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
          <meshStandardMaterial
            color="#c0c0cc"
            metalness={1}
            roughness={0.15}
          />
        </mesh>

        {/* Watch glass (crystal) */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.98, 0.98, 0.08, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.95}
            thickness={0.5}
            ior={1.5}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Strap - top */}
        <mesh position={[0, 0, -1.5]}>
          <boxGeometry args={[0.5, 0.12, 1.2]} />
          <meshStandardMaterial
            color="#1a1a1e"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Strap - bottom */}
        <mesh position={[0, 0, 1.5]}>
          <boxGeometry args={[0.5, 0.12, 1.2]} />
          <meshStandardMaterial
            color="#1a1a1e"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Lug connectors */}
        {[-0.22, 0.22].map((x) =>
          [-0.85, 0.85].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0, z]}>
              <boxGeometry args={[0.08, 0.2, 0.15]} />
              <meshStandardMaterial color="#c0c0cc" metalness={1} roughness={0.1} />
            </mesh>
          ))
        )}

        {/* Brand text placeholder - small dot */}
        <mesh position={[0, 0.186, -0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.005, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-steel-light/50 text-sm tracking-widest uppercase animate-pulse">
        Loading 3D Model...
      </div>
    </div>
  );
}

export default function Watch3D() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-steel-dark text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Interactive Experience
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient-steel tracking-tight">
            Crafted To Perfection
          </h2>
        </div>

        <div className="h-[400px] md:h-[550px] w-full cursor-grab active:cursor-grabbing">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 2, 4.5], fov: 40 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
            >
              <ambientLight intensity={0.3} />
              <spotLight
                position={[5, 8, 5]}
                angle={0.3}
                penumbra={0.8}
                intensity={1.5}
                castShadow
                color="#e0e0f0"
              />
              <spotLight
                position={[-5, 5, -3]}
                angle={0.4}
                penumbra={1}
                intensity={0.8}
                color="#8090b0"
              />
              <pointLight position={[0, -3, 0]} intensity={0.2} color="#4050a0" />

              <WatchModel />

              <ContactShadows
                position={[0, -1.8, 0]}
                opacity={0.4}
                scale={8}
                blur={2.5}
                far={4}
              />

              <Environment preset="studio" />
            </Canvas>
          </Suspense>
        </div>

        <p className="text-center text-muted-foreground/60 text-xs tracking-widest uppercase mt-4">
          Drag to rotate • Scroll to explore
        </p>
      </div>
    </section>
  );
}
