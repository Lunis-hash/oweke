"use client";

import { motion } from "framer-motion";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export default function BorderBeam({
  size = 200,
  duration = 8,
  colorFrom = "#7c3aed",
  colorTo = "#f43f5e",
  className = "",
}: BorderBeamProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}>
      <motion.div
        className="absolute aspect-square opacity-80"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to right, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
        }}
      />
    </div>
  );
}
