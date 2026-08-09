"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "live" | "primary" | "accent" | "success" | "outline";
  pulse?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  pulse = false,
  className = "",
}: BadgeProps) {
  
  const variantStyles = {
    live: "bg-rose-100 text-rose-700 border-rose-300",
    primary: "bg-rose-50 text-rose-800 border-rose-200",
    accent: "bg-purple-50 text-purple-800 border-purple-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    outline: "bg-white/80 text-stone-700 border-stone-200",
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider uppercase border rounded-full backdrop-blur-md ${variantStyles[variant]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
      )}
      {children}
    </span>
  );
}
