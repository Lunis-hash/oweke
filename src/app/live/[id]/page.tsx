"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import VideoGrid from "@/components/live/VideoGrid";
import RoundTimer from "@/components/live/RoundTimer";
import SoftViewOverlay from "@/components/live/SoftViewOverlay";
import MatchCelebrationModal from "@/components/live/MatchCelebrationModal";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { Participant, Match, LiveSessionStatus } from "@/types";
import { Heart, Sparkles, LogOut, ArrowRight, SkipForward, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { soundEffects } from "@/utils/soundEffects";

const MOCK_PARTNERS: Participant[] = [
  {
    id: "user-01",
    name: "Camille",
    age: 28,
    city: "Paris (75011)",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "user-02",
    name: "Sophie",
    age: 26,
    city: "Boulogne-Billancourt",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "user-03",
    name: "Léa",
    age: 30,
    city: "Paris (75004)",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "user-04",
    name: "Élodie",
    age: 27,
    city: "Montreuil",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
];

interface UserNote {
  partnerId: string;
  partnerName: string;
  liked: boolean;
  note?: string;
}

export default function LiveSessionPage() {
  const params = useParams();
  const router = useRouter();

  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 4;
  const [liveState, setLiveState] = useState<LiveSessionStatus>("IN_ROUND");
  const [roundTimer, setRoundTimer] = useState(30); // 30s per round for interactive testing
  const [softViewTimer, setSoftViewTimer] = useState(15);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, UserNote>>({});

  const currentPartner = MOCK_PARTNERS[(currentRound - 1) % MOCK_PARTNERS.length];

  // Play audio chime when entering IN_ROUND
  useEffect(() => {
    if (liveState === "IN_ROUND") {
      soundEffects.playRoundStart();
    }
  }, [liveState, currentRound]);

  // Primary Live Round Timer Loop
  useEffect(() => {
    if (liveState !== "IN_ROUND") return;

    if (roundTimer <= 0) {
      setLiveState("SOFT_VIEW");
      setSoftViewTimer(15);
      return;
    }

    const timer = setInterval(() => {
      setRoundTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [roundTimer, liveState]);

  // Soft View 15s Timer Loop
  useEffect(() => {
    if (liveState !== "SOFT_VIEW") return;

    if (softViewTimer <= 0) {
      if (currentRound >= totalRounds) {
        setLiveState("SESSION_END");
      } else {
        setCurrentRound((prev) => prev + 1);
        setRoundTimer(30);
        setLiveState("IN_ROUND");
      }
      return;
    }

    const timer = setInterval(() => {
      setSoftViewTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [softViewTimer, liveState, currentRound, totalRounds]);

  const handleRate = (liked: boolean, note?: string) => {
    // Save note locally
    if (currentPartner) {
      setUserNotes((prev) => ({
        ...prev,
        [currentPartner.id]: {
          partnerId: currentPartner.id,
          partnerName: currentPartner.name,
          liked,
          note,
        },
      }));
    }

    if (liked && (currentRound === 1 || currentRound === 3)) {
      // Simulate Reciprocal Match Trigger on Round 1 and 3 for demo WOW factor
      setTimeout(() => {
        setCurrentMatch({
          id: `match-${Date.now()}`,
          sessionId: (params.id as string) || "session-01",
          partner: currentPartner,
          matchedAt: "À l'instant",
          contactEmail: `${currentPartner.name.toLowerCase()}@fastdate.fr`,
        });
      }, 600);
    }
  };

  const skipToSoftView = () => {
    setLiveState("SOFT_VIEW");
    setSoftViewTimer(15);
  };

  const skipToNextRound = () => {
    if (currentRound >= totalRounds) {
      setLiveState("SESSION_END");
    } else {
      setCurrentRound((prev) => prev + 1);
      setRoundTimer(30);
      setLiveState("IN_ROUND");
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto flex flex-col justify-between select-none">
      
      {/* Top Session Header Navigation */}
      <div className="flex justify-between items-center mb-4 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/sessions"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-colors"
            title="Quitter la session"
          >
            <LogOut className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold text-white text-sm md:text-base tracking-tight">
              Session Paris & Île-de-France (Speed Dating)
            </h1>
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Synchrone • Salon VIP
            </p>
          </div>
        </div>

        <RoundTimer
          remainingSeconds={liveState === "SOFT_VIEW" ? softViewTimer : roundTimer}
          totalSeconds={liveState === "SOFT_VIEW" ? 15 : 30}
          label={liveState === "SOFT_VIEW" ? "TRANSITION SOFT VIEW" : `ROUND ACTIF (${currentRound}/${totalRounds})`}
          isSoftView={liveState === "SOFT_VIEW"}
        />

        {/* Demo Fast Navigation Controls */}
        <div className="flex items-center gap-2">
          {liveState === "IN_ROUND" ? (
            <Button variant="outline" size="sm" onClick={skipToSoftView} rightIcon={<SkipForward className="w-3.5 h-3.5" />}>
              Soft View
            </Button>
          ) : liveState === "SOFT_VIEW" ? (
            <Button variant="accent" size="sm" onClick={skipToNextRound} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Round Suivant
            </Button>
          ) : null}
        </div>
      </div>

      {/* Main Video Arena or Session End Summary */}
      {liveState === "SESSION_END" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto my-8 w-full"
        >
          <GlassCard glowColor="purple" className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(244,63,94,0.5)]">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Session Fast Date Terminée !</h2>
              <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                Félicitations ! Vous avez complété vos {totalRounds} rounds en rotation vidéo synchrone.
              </p>
            </div>

            {/* Session Notes Recap */}
            {Object.keys(userNotes).length > 0 && (
              <div className="text-left bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" /> Vos Notes Privées & Votes
                </h4>

                <div className="space-y-2">
                  {Object.values(userNotes).map((item) => (
                    <div key={item.partnerId} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.liked ? "bg-rose-500" : "bg-white/30"}`} />
                        <span className="font-bold text-xs text-white">{item.partnerName}</span>
                        {item.note && <span className="text-xs text-white/60 font-light italic">« {item.note} »</span>}
                      </div>
                      <Badge variant={item.liked ? "accent" : "outline"}>
                        {item.liked ? "Coup de Cœur" : "Passé"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link href="/matches" className="w-full block">
                <Button variant="accent" fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Découvrir mes Matchs Réciproques
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <VideoGrid
          partner={currentPartner}
          roundNumber={currentRound}
          totalRounds={totalRounds}
        />
      )}

      {/* Soft View Post-Round Rating Overlay */}
      {liveState === "SOFT_VIEW" && (
        <SoftViewOverlay
          partner={currentPartner}
          roundNumber={currentRound}
          totalRounds={totalRounds}
          remainingSeconds={softViewTimer}
          onRate={handleRate}
        />
      )}

      {/* Reciprocal Match Celebration Modal */}
      {currentMatch && (
        <MatchCelebrationModal
          match={currentMatch}
          onClose={() => setCurrentMatch(null)}
        />
      )}

    </div>
  );
}
