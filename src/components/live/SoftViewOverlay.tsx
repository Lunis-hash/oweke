"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles, MessageSquare, Tag, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import RoundTimer from "./RoundTimer";
import { Participant } from "@/types";
import { soundEffects } from "@/utils/soundEffects";

interface SoftViewOverlayProps {
  partner: Participant | null;
  roundNumber: number;
  totalRounds: number;
  remainingSeconds: number;
  onRate: (liked: boolean, note?: string) => void;
}

export default function SoftViewOverlay({
  partner,
  roundNumber,
  totalRounds,
  remainingSeconds,
  onRate,
}: SoftViewOverlayProps) {
  const [selectedRating, setSelectedRating] = useState<boolean | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    soundEffects.playSoftViewTransition();
  }, []);

  const handleSelect = (liked: boolean) => {
    setSelectedRating(liked);
    onRate(liked, note);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative max-w-lg w-full bg-[#0d0d14] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(244,63,94,0.3)] text-center overflow-hidden my-auto"
        >
          {/* Ambient Lighting Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/30 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Timer */}
          <div className="mb-6 flex flex-col items-center">
            <span className="font-mono text-xs text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" /> Phase de Transition Soft View
            </span>
            <RoundTimer
              remainingSeconds={remainingSeconds}
              totalSeconds={15}
              label={`FIN DU ROUND ${roundNumber} / ${totalRounds}`}
              isSoftView={true}
            />
          </div>

          {/* Partner Summary Card */}
          {partner && (
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-500/50 shadow-lg shrink-0">
                {/* eslint-disable-next-html-element-walkaround */}
                <img src={partner.photoUrl} alt={partner.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{partner.name}, {partner.age} ans</h3>
                <p className="text-xs text-white/60 mb-1.5">{partner.city}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5 text-rose-400" /> Échange fluide
                  </span>
                  <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5 text-purple-400" /> 100% Vérifié
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rating Decision Prompt */}
          {!submitted ? (
            <div className="space-y-6">
              <p className="text-sm sm:text-base text-white/90 font-light">
                Avez-vous ressenti une étincelle avec <span className="font-bold text-white">{partner?.name || "votre partenaire"}</span> ?
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(false)}
                  className="flex flex-col items-center justify-center p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-white/60 group-hover:text-white" />
                  </div>
                  <span className="font-semibold text-sm text-white/80">Passer</span>
                  <span className="text-[10px] text-white/40 font-mono">Pas cette fois</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(true)}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-tr from-rose-600/30 to-purple-600/30 hover:from-rose-600/40 hover:to-purple-600/40 border border-rose-500/50 rounded-2xl transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)] group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <span className="font-bold text-sm text-white">Coup de Cœur</span>
                  <span className="text-[10px] text-rose-300 font-mono">Je souhaite matcher</span>
                </motion.button>
              </div>

              {/* Optional Private Note */}
              <div className="relative pt-2 text-left">
                <label className="block text-[11px] font-mono text-white/60 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  Note privée (visible uniquement par vous dans votre récapitulatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 'Adore les voyages en Italie, très souriant(e)'"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/60"
                />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Choix Enregistré !</h3>
              <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                {selectedRating
                  ? "Votre Coup de Cœur a été enregistré en toute confidentialité. Découverte des matchs à la fin de la session !"
                  : "Votre décision a été prise en compte. Préparation du binôme suivant..."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
