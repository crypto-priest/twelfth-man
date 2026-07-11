"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Ball() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.3;
    // lean toward the cursor, gently
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.3, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.5, 0.04);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial
          color="#0c2418"
          flatShading
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh scale={1.003}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#00ff87" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

const PALETTE = ["#00ff87", "#75aadb", "#ffdc02", "#e30613", "#ffffff", "#f36c21"];

function Crowd() {
  const points = useRef<THREE.Points>(null);
  const count = 600;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = PALETTE.map((c) => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 2.5;
      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02;
      points.current.rotation.x = state.pointer.y * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Floodlight({ position, target }: { position: [number, number, number]; target: [number, number, number] }) {
  const cone = useRef<THREE.Mesh>(null);
  const dir = useMemo(() => {
    const from = new THREE.Vector3(...position);
    const to = new THREE.Vector3(...target);
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      to.clone().sub(from).normalize()
    );
    return q;
  }, [position, target]);

  return (
    <mesh ref={cone} position={position} quaternion={dir}>
      <coneGeometry args={[1.6, 9, 24, 1, true]} />
      <meshBasicMaterial
        color="#bfffe0"
        transparent
        opacity={0.045}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} color="#f0fff8" />
      <pointLight position={[-5, -2, 2]} intensity={1.2} color="#00ff87" />
      <Ball />
      <Crowd />
      <Floodlight position={[-4.5, 5.5, -1]} target={[0, 0, 0]} />
      <Floodlight position={[4.5, 5.5, -1]} target={[0, 0, 0]} />
    </Canvas>
  );
}
