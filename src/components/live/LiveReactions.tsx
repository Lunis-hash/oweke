"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingEmoji {
  id: string;
  emoji: string;
  xOffset: number;
}

const EMOJI_OPTIONS = ["❤️", "🔥", "😂", "👏", "✨", "🍷"];

export default function LiveReactions() {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const handleSendReaction = (emoji: string) => {
    const newReaction: FloatingEmoji = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      xOffset: Math.floor(Math.random() * 80) - 40, // Random float offset X
    };

    setFloatingEmojis((prev) => [...prev, newReaction]);

    // Cleanup after animation (2.5s)
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newReaction.id));
    }, 2500);
  };

  return (
    <div className="relative">
      {/* Floating Animated Emoji Layer */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: "80vh", scale: 0.5, x: `calc(50vw + ${item.xOffset}px)` }}
              animate={{ opacity: 0, y: "20vh", scale: 1.8, x: `calc(50vw + ${item.xOffset * 2}px)` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction Buttons Pill */}
      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
        {EMOJI_OPTIONS.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => handleSendReaction(emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-white/10 rounded-full transition-all"
            title={`Envoyer ${emoji}`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
