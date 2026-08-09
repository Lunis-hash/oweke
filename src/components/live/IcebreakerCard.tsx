"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface IcebreakerQuestion {
  id: string;
  category: "FUN" | "VOYAGE" | "PASSION" | "DEEP";
  text: string;
}

const ICEBREAKER_QUESTIONS: IcebreakerQuestion[] = [
  { id: "q1", category: "FUN", text: "Quel est le talent le plus inutile mais impressionnant que tu possèdes ?" },
  { id: "q2", category: "VOYAGE", text: "Si tu pouvais t'envoler demain vers n'importe quelle destination sans limite de budget, où irais-tu ?" },
  { id: "q3", category: "PASSION", text: "Quelle est la passion ou l'activité qui te fait totalement oublier le temps qui passe ?" },
  { id: "q4", category: "FUN", text: "Plutôt café gourmand en terrasse un dimanche matin ou cocktail rooftop le samedi soir ?" },
  { id: "q5", category: "DEEP", text: "Qu'est-ce qui te fait le plus rire aux éclats chez quelqu'un dès le premier contact ?" },
  { id: "q6", category: "VOYAGE", text: "Plutôt road trip improvisé sac au dos ou hôtel 5 étoiles farniente au bord de la plage ?" },
  { id: "q7", category: "PASSION", text: "Quel est le dernier livre, film ou morceau de musique qui t'a sincèrement marqué ?" },
  { id: "q8", category: "DEEP", text: "Quelle est la qualité essentielle qui te séduit immédiatement chez une personne ?" },
];

export default function IcebreakerCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = ICEBREAKER_QUESTIONS[currentIndex];

  const handleNextQuestion = () => {
    setCurrentIndex((prev) => (prev + 1) % ICEBREAKER_QUESTIONS.length);
  };

  const getCategoryBadgeClass = (category: IcebreakerQuestion["category"]) => {
    switch (category) {
      case "FUN":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "VOYAGE":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "PASSION":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "DEEP":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    }
  };

  return (
    <div className="relative z-30">
      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600/90 to-purple-600/90 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-semibold rounded-full border border-white/20 shadow-[0_0_20px_rgba(225,29,72,0.4)] backdrop-blur-xl transition-all duration-300 active:scale-95"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Sujets Brise-Glace</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Expanded Icebreaker Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-12 left-0 sm:left-auto right-0 w-80 sm:w-96 bg-[#0a0a10]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-left"
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Question Inspirante</h4>
              </div>
              <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(currentQuestion.category)}`}>
                {currentQuestion.category}
              </span>
            </div>

            <div className="min-h-[60px] flex items-center py-2">
              <p className="text-sm font-medium text-white/95 leading-relaxed italic">
                « {currentQuestion.text} »
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
              <span className="text-[10px] text-white/40 font-mono">
                Idée #{currentIndex + 1} sur {ICEBREAKER_QUESTIONS.length}
              </span>
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Autre question
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
