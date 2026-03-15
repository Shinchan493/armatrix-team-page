"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  scrollProgress: number;
};

function NeuralField({ scrollProgress }: Props) {
  const groupRef = useRef<THREE.Group | null>(null);

  const points = useMemo(() => {
    const total = 1800;
    const positions = new Float32Array(total * 3);

    for (let i = 0; i < total; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 16;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 18;
    }

    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      scrollProgress * Math.PI * 0.85 + time * 0.03,
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.14 + scrollProgress * 0.3,
      0.05,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -2 + scrollProgress * 2.6, 0.04);

    const pulse = 1 + Math.sin(time * 1.6) * 0.04;
    groupRef.current.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), Math.min(1, delta * 2.4));
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[2.9, 1]} />
          <meshStandardMaterial
            color="white"
            transparent
            opacity={0.08}
            emissive="white"
            emissiveIntensity={0.2}
            wireframe
          />
        </mesh>
      </Float>

      <Points positions={points} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="white"
          opacity={0.65}
          size={0.018}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function TeamBackground3D({ scrollProgress }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 55 }}>
        <color attach="background" args={["#05070c"]} />
        <fog attach="fog" args={["#05070c", 8, 22]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 3, 5]} intensity={1} color="#8fd8ff" />
        <directionalLight position={[-3, -2, -3]} intensity={0.5} color="#9a7dff" />
        <NeuralField scrollProgress={scrollProgress} />
      </Canvas>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,229,255,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(200,80,192,0.08),transparent_35%)]" />
    </div>
  );
}
