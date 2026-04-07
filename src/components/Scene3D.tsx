import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import CDCase from "./CDCase";

export default function Scene3D() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);

  const piece = PIECES.find((p) => p.slug === selectedSlug);
  const textureUrl = piece?.coverArt ?? piece?.image;
  const coverColor = piece?.cover.bg ?? "#1a1a1a";

  return (
    <motion.div
      layoutId="scene3d"
      className="w-full h-full"
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[2, 3, 4]}
          intensity={0.6}
          color="#f0eee8"
        />
        <Suspense fallback={null}>
          <CDCase textureUrl={textureUrl} coverColor={coverColor} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
