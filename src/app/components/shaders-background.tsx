"use client";

import { GrainGradient, SimplexNoise } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

export function ShadersBackground() {
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Handle resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
      <GrainGradient
        width={dimensions.width}
        height={dimensions.height}
        colors={["#1e293b", "#f5f8ff", "#64748b"]}
        colorBack="#0f1419"
        softness={0}
        intensity={0.2}
        noise={1}
        shape="truchet"
        speed={1}
      />
    </div>
  );
}
