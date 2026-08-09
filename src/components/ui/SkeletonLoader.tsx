"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export default function SkeletonLoader({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonLoaderProps) {
  
  const baseClasses = "relative overflow-hidden bg-white/5 border border-white/5 backdrop-blur-md";

  const variantClasses = {
    text: "h-4 rounded-md w-3/4",
    circular: "rounded-full w-12 h-12",
    rectangular: "rounded-2xl w-full h-32",
    card: "rounded-3xl w-full h-64 p-6 flex flex-col justify-between",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      {/* Animated Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function SessionSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-6 bg-[#0a0a0c]/60 border border-white/10 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <SkeletonLoader variant="text" className="w-1/3" />
            <SkeletonLoader variant="circular" className="w-8 h-8" />
          </div>
          <SkeletonLoader variant="rectangular" className="h-24 rounded-2xl" />
          <div className="flex gap-4 pt-2">
            <SkeletonLoader variant="text" className="w-1/2 h-8 rounded-full" />
            <SkeletonLoader variant="text" className="w-1/2 h-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
