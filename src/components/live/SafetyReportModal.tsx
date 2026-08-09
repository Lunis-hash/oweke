"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, EyeOff, Flag, Check, X } from "lucide-react";
import Button from "../ui/Button";

interface SafetyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlurScreenToggle: () => void;
  isScreenBlurred: boolean;
}

export default function SafetyReportModal({
  isOpen,
  onClose,
  onBlurScreenToggle,
  isScreenBlurred,
}: SafetyReportModalProps) {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  if (!isOpen) return null;

  const handleReport = (reason: string) => {
    setSelectedReason(reason);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-md w-full bg-[#110d18] border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_80px_rgba(244,63,94,0.3)] text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Espace Sécurité & Modération</h3>
              <p className="text-xs text-white/50">Centre d'aide et de bienveillance</p>
            </div>
          </div>

          {!reportSubmitted ? (
            <div className="space-y-4">
              {/* Emergency Privacy Blur Button */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Flouter ma vidéo instantanément</h4>
                  <p className="text-xs text-white/50">Masque immédiatement votre flux vidéo pour préserver votre vie privée.</p>
                </div>
                <button
                  onClick={onBlurScreenToggle}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                    isScreenBlurred
                      ? "bg-rose-500 text-white border-rose-400"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  {isScreenBlurred ? "Actif" : "Flouter"}
                </button>
              </div>

              {/* Signalement Section */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-amber-400" /> Signaler le partenaire actuel
                </h4>
                <p className="text-xs text-white/60">
                  Votre signalement est totalement anonyme. Il nous permet d'exclure les profils irrespectueux.
                </p>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  {[
                    "Comportement inapproprié ou irrespectueux",
                    "Flux vidéo non conforme ou absent",
                    "Propos blessants ou déplacés",
                    "Usurpation d'identité ou spam",
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleReport(reason)}
                      className="text-left px-3.5 py-2.5 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 rounded-xl text-xs text-white/80 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button variant="ghost" fullWidth onClick={onClose} size="sm">
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Signalement Transmis</h4>
              <p className="text-xs text-white/60 max-w-xs mx-auto">
                Notre équipe de modération analyse votre signalement ({selectedReason}). Merci de préserver la communauté.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
