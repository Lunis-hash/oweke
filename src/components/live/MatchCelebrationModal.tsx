"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "../ui/Button";
import { Match } from "@/types";
import { soundEffects } from "@/utils/soundEffects";

interface MatchCelebrationModalProps {
  match: Match | null;
  onClose: () => void;
}

export default function MatchCelebrationModal({ match, onClose }: MatchCelebrationModalProps) {
  useEffect(() => {
    if (match) {
      soundEffects.playMatchFanfare();
    }
  }, [match]);

  if (!match) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative max-w-md w-full bg-gradient-to-b from-[#160a24] via-[#0d0716] to-[#050308] border border-rose-500/50 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(244,63,94,0.5)] overflow-hidden"
        >
          {/* Confetti Glow Background Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3)_0,transparent_70%)] pointer-events-none" />

          {/* Heart Icon Celebration Badge */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(244,63,94,0.9)]"
          >
            <Heart className="w-10 h-10 text-white fill-white" />
          </motion.div>

          <span className="font-mono text-xs text-rose-300 uppercase tracking-widest flex items-center justify-center gap-2 mb-2 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" /> C'est un Match Réciproque !
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">
            Vous et {match.partner.name}
          </h2>

          <p className="text-sm text-white/80 font-light mb-8 leading-relaxed">
            L'étincelle s'est produite lors du Fast Date ! Vos choix de Coup de Cœur se sont croisés en direct.
          </p>

          {/* Partner Photo Card */}
          <div className="mb-8 flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-500 shadow-md">
              {/* eslint-disable-next-html-element-walkaround */}
              <img src={match.partner.photoUrl} alt={match.partner.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-base">{match.partner.name}, {match.partner.age} ans</h4>
              <p className="text-xs text-white/50">{match.partner.city}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/matches" className="w-full block">
              <Button variant="accent" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                Découvrir mes Matchs
              </Button>
            </Link>

            <Button variant="ghost" fullWidth onClick={onClose}>
              Poursuivre la session
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
