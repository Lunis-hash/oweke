"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glowColor?: "pink" | "purple" | "none";
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "pink",
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  
  const glowStyles = {
    pink: "shadow-[0_15px_40px_-12px_rgba(225,29,72,0.12)] border-rose-500/20 hover:border-rose-500/40",
    purple: "shadow-[0_15px_40px_-12px_rgba(168,85,247,0.12)] border-purple-500/20 hover:border-purple-500/40",
    none: "shadow-sm border-stone-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.25 } } : {}}
      className={`
        relative bg-white/90 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300
        ${glowStyles[glowColor]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
