"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { soundEffects } from "@/utils/soundEffects";

interface RoundTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  label?: string;
  isSoftView?: boolean;
}

export default function RoundTimer({
  remainingSeconds,
  totalSeconds,
  label = "TEMPS DU ROUND",
  isSoftView = false,
}: RoundTimerProps) {
  const percentage = Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100));

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const isLowTime = remainingSeconds > 0 && remainingSeconds <= 10;

  // Trigger low time warning tick for remainingSeconds <= 5
  useEffect(() => {
    if (!isSoftView && remainingSeconds > 0 && remainingSeconds <= 5) {
      soundEffects.playCountdownTick();
    }
  }, [remainingSeconds, isSoftView]);

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div
        className={`relative flex items-center justify-center px-6 py-2 bg-black/70 backdrop-blur-2xl border transition-all duration-300 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] ${
          isLowTime
            ? "border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)] animate-pulse"
            : "border-white/20"
        }`}
      >
        {/* Animated Status Pulse */}
        <span className="flex h-3 w-3 mr-3">
          <span
            className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${
              isLowTime
                ? "bg-rose-500"
                : isSoftView
                ? "bg-accent"
                : "bg-emerald-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${
              isLowTime
                ? "bg-rose-600"
                : isSoftView
                ? "bg-accent"
                : "bg-emerald-500"
            }`}
          />
        </span>

        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
            {label}
          </span>
          <span
            className={`font-mono font-extrabold text-2xl tracking-tighter transition-colors ${
              isLowTime
                ? "text-rose-400"
                : isSoftView
                ? "text-accent"
                : "text-white"
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Radial / Linear Progress Bar */}
      <div className="w-48 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden border border-white/10">
        <motion.div
          className={`h-full rounded-full ${
            isLowTime
              ? "bg-rose-500"
              : isSoftView
              ? "bg-gradient-to-r from-accent to-rose-500"
              : "bg-gradient-to-r from-primary to-accent"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}
