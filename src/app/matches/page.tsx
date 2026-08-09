"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, MessageCircle, Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Match } from "@/types";

const MOCK_MATCHES: Match[] = [
  {
    id: "match-01",
    sessionId: "session-75-01",
    partner: {
      id: "user-camille",
      name: "Camille",
      age: 28,
      city: "Paris (75011)",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
    matchedAt: "Aujourd'hui à 20:45",
    contactEmail: "camille.p@example.com",
    whatsapp: "+33 6 12 34 56 78",
  },
  {
    id: "match-02",
    sessionId: "session-69-02",
    partner: {
      id: "user-sophie",
      name: "Sophie",
      age: 26,
      city: "Boulogne-Billancourt",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    },
    matchedAt: "Hier à 21:15",
    contactEmail: "sophie.b@example.com",
    whatsapp: "+33 6 98 76 54 32",
  },
];

export default function MatchesPage() {
  const [matches] = useState<Match[]>(MOCK_MATCHES);

  return (
    <div className="min-h-screen px-4 md:px-8 py-12 max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <Badge variant="accent" pulse={true} className="mb-2">
          Révélation des Matchs Réciproques
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Vos Électrons Libres Connectés.
        </h1>
        
        <p className="text-white/60 font-light text-base">
          Voici les personnes avec qui vous avez échangé un Coup de Cœur mutuel lors de vos sessions de Fast Date.
        </p>
      </div>

      {/* Matches Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <GlassCard glowColor="pink" className="p-8 relative overflow-hidden group">
                {/* Background Sparkles Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Photo Profile */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-accent shadow-[0_0_25px_rgba(244,63,94,0.4)] flex-shrink-0">
                    {/* eslint-disable-next-html-element-walkaround */}
                    <img
                      src={match.partner.photoUrl}
                      alt={match.partner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-2xl font-bold text-white">{match.partner.name}, {match.partner.age} ans</h3>
                      <Badge variant="success">Match Réciproque</Badge>
                    </div>

                    <p className="text-xs text-white/50">{match.partner.city}</p>
                    <p className="text-[10px] font-mono text-accent">Matché : {match.matchedAt}</p>
                  </div>
                </div>

                {/* Contact Card Details Revealed */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 bg-white/5 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="flex items-center gap-2 text-white/50">
                      <Mail className="w-4 h-4 text-accent" /> Email direct :
                    </span>
                    <span className="font-mono font-semibold">{match.contactEmail}</span>
                  </div>

                  {match.whatsapp && (
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-2 text-white/50">
                        <Phone className="w-4 h-4 text-emerald-400" /> WhatsApp :
                      </span>
                      <span className="font-mono font-semibold text-emerald-400">{match.whatsapp}</span>
                    </div>
                  )}
                </div>

                {/* Action CTA */}
                <div className="mt-6">
                  <a
                    href={`https://wa.me/${match.whatsapp?.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button variant="accent" fullWidth rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                      Engager la Conversation sur WhatsApp
                    </Button>
                  </a>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Aucun Match pour l'instant</h3>
          <p className="text-xs text-white/60 mb-6">
            Participez à votre prochaine session de Fast Date pour rencontrer de nouveaux célibataires.
          </p>
          <Button variant="primary">Parcourir les Sessions</Button>
        </div>
      )}

    </div>
  );
}
