"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Mic, ShieldCheck, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [micTested, setMicTested] = useState(true);
  const [camTested, setCamTested] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [participantsReady, setParticipantsReady] = useState(14);
  const totalRequired = 16;

  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/live/${sessionId || "session-75-01"}`);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, router, sessionId]);

  return (
    <div className="min-h-screen px-4 md:px-8 py-12 max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
      
      {/* Top Session Badge */}
      <div className="mb-6">
        <Badge variant="live" pulse={true}>
          Salle d'Attente Interactive — Session #{sessionId || "75-01"}
        </Badge>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
        Préparez-vous à entrer dans l'Arène.
      </h1>

      <p className="text-white/60 text-sm md:text-base max-w-lg mb-10 font-light">
        Vérifiez votre équipement pendant que le serveur orchestre les rotations de binômes. Le Round 1 démarre automatiquement.
      </p>

      {/* Main Waiting Card */}
      <GlassCard glowColor="purple" className="w-full max-w-2xl p-8 mb-8 space-y-8">
        
        {/* Countdown Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 shadow-[0_0_50px_rgba(124,58,237,0.2)]">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent animate-[spin_6s_linear_infinite]"
              style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
            />
            <div className="text-center">
              <span className="font-mono text-3xl font-bold text-white">{countdown}s</span>
              <span className="block font-mono text-[9px] text-white/50 uppercase tracking-widest">Lancement</span>
            </div>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 flex items-center gap-1.5 font-mono">
              <Users className="w-4 h-4 text-accent" /> Participants en attente :
            </span>
            <span className="font-mono font-bold text-white">
              {participantsReady} / {totalRequired} connectés
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${(participantsReady / totalRequired) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Equipment Check Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">Microphone</h5>
                <p className="text-[10px] text-white/50">Flux audio détecté</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">Caméra HD</h5>
                <p className="text-[10px] text-white/50">Vidéo WebRTC prête</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Direct Bypass Button */}
        <Button
          variant="accent"
          fullWidth
          onClick={() => router.push(`/live/${sessionId || "session-75-01"}`)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Entrer Immédiatement dans le Live
        </Button>

      </GlassCard>

    </div>
  );
}
