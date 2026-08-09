"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1], // Vengeance UI smooth kinetic curve
        delay: delay 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
      className={`glass-panel ${className}`}
    >
      {children}
    </motion.div>
  );
}
