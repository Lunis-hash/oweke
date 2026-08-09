"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "accent" | "glass" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs tracking-wider uppercase",
    md: "px-6 py-3 text-sm font-semibold tracking-wide",
    lg: "px-8 py-4 text-base font-bold tracking-wide",
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-[0_8px_25px_rgba(225,29,72,0.3)] hover:shadow-[0_12px_30px_rgba(225,29,72,0.45)] border border-rose-400/30",
    accent: "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-[0_8px_25px_rgba(225,29,72,0.3)] hover:shadow-[0_12px_30px_rgba(168,85,247,0.4)] border border-rose-400/30",
    glass: "bg-white/80 backdrop-blur-xl border border-rose-200 text-stone-800 hover:bg-white hover:border-rose-300 shadow-sm",
    outline: "border border-rose-300 text-rose-900 hover:bg-rose-50 hover:border-rose-400",
    ghost: "text-stone-700 hover:text-rose-600 hover:bg-rose-50/60",
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Dynamic Background Glow Effect */}
      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Chargement...</span>
        </span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2">
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
}
