"use client";

import { SimplexNoise } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

export function SimplexBackground() {
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
      <SimplexNoise
        width={dimensions.width}
        height={dimensions.height}
        colors={["#1a1a1a", "#4a1a1a", "#1a1a4a", "#1a4a4a"]}
        stepsPerColor={1}
        softness={1}
        speed={2}
        scale={1.6}
      />
    </div>
  );
}
