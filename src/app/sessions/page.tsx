"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Clock, MapPin, Sparkles, Filter, ShieldCheck, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SkeletonLoader, { SessionSkeletonGrid } from "@/components/ui/SkeletonLoader";
import StripePaymentModal from "@/components/payment/StripePaymentModal";
import { Session } from "@/types";

const MOCK_SESSIONS: Session[] = [
  {
    id: "session-75-01",
    title: "Session Paris & Île-de-France (25-35 ans)",
    date: "Aujourd'hui",
    time: "20:30",
    department: "75 - Paris",
    category: "Célibataires 25-35 ans",
    durationRoundMin: 5,
    totalRounds: 6,
    maxParticipants: 16,
    currentParticipants: 14,
    price: 15,
    status: "LIVE",
  },
  {
    id: "session-69-02",
    title: "Session Lyon & Rhône-Alpes (30-42 ans)",
    date: "Ce soir",
    time: "21:00",
    department: "69 - Rhône",
    category: "Célibataires 30-42 ans",
    durationRoundMin: 5,
    totalRounds: 8,
    maxParticipants: 20,
    currentParticipants: 18,
    price: 15,
    status: "UPCOMING",
  },
  {
    id: "session-13-03",
    title: "Session Marseille & Provence (28-40 ans)",
    date: "Demain",
    time: "20:00",
    department: "13 - Bouches-du-Rhône",
    category: "Célibataires 28-40 ans",
    durationRoundMin: 5,
    totalRounds: 6,
    maxParticipants: 16,
    currentParticipants: 10,
    price: 15,
    status: "UPCOMING",
  },
  {
    id: "session-33-04",
    title: "Session Bordeaux & Nouvelle-Aquitaine",
    date: "Jeudi 7 Août",
    time: "20:30",
    department: "33 - Gironde",
    category: "Célibataires 25-38 ans",
    durationRoundMin: 5,
    totalRounds: 6,
    maxParticipants: 16,
    currentParticipants: 8,
    price: 12,
    status: "UPCOMING",
  },
];

export default function SessionsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookedSessions, setBookedSessions] = useState<string[]>([]);
  
  // Stripe Modal States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSessionForPayment, setSelectedSessionForPayment] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("oweke_booked_sessions");
      if (savedBookings) {
        setBookedSessions(JSON.parse(savedBookings));
      }
    } catch {
      // Ignored
    }

    const timer = setTimeout(() => {
      setSessions(MOCK_SESSIONS);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenPayment = (session: Session) => {
    setSelectedSessionForPayment(session);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (sessionId: string) => {
    const updated = [...bookedSessions, sessionId];
    setBookedSessions(updated);
    try {
      localStorage.setItem("oweke_booked_sessions", JSON.stringify(updated));
    } catch {
      // Ignored
    }
  };

  const filteredSessions = selectedDept === "ALL" 
    ? sessions 
    : sessions.filter(s => s.department.includes(selectedDept));

  return (
    <div className="min-h-screen px-4 md:px-8 py-12 max-w-7xl mx-auto bg-[#fbf8f5] text-[#1c1917]">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 pt-12">
        <Badge variant="primary" pulse={true} className="mb-2">
          Sessions Fast Dating en Direct
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-900">
          Réservez votre place dans l'arène.
        </h1>
        
        <p className="text-lg text-stone-600 font-light">
          Chaque session rassemble un nombre égal de participants en rotation automatique. 5 minutes par rendez-vous, 100% de présence réelle.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-rose-900/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-mono text-stone-500 uppercase mr-2 flex items-center gap-1 font-semibold">
            <Filter className="w-3.5 h-3.5 text-rose-600" /> Département :
          </span>
          {[
            { id: "ALL", label: "Tous" },
            { id: "75", label: "75 Paris" },
            { id: "69", label: "69 Rhône" },
            { id: "13", label: "13 Provence" },
            { id: "33", label: "33 Gironde" },
          ].map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                selectedDept === dept.id
                  ? "bg-rose-600 text-white font-bold shadow-md"
                  : "bg-white border border-rose-200 text-stone-700 hover:bg-rose-50 hover:text-stone-900"
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-stone-500 font-medium">
          {filteredSessions.length} session(s) disponible(s)
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <SessionSkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session, index) => {
            const isBooked = bookedSessions.includes(session.id);
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard 
                  glowColor={session.status === "LIVE" ? "pink" : isBooked ? "pink" : "purple"}
                  className="h-full flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Status & Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={session.status === "LIVE" ? "live" : isBooked ? "success" : "outline"} pulse={session.status === "LIVE"}>
                        {session.status === "LIVE" ? "EN DIRECT MAINTENANT" : isBooked ? "Billet Payé & Validé" : `${session.date} à ${session.time}`}
                      </Badge>
                      <span className="font-bold text-lg text-rose-600">{session.price} €</span>
                    </div>

                    {/* Title & Dept */}
                    <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-rose-600 transition-colors">
                      {session.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>{session.department}</span>
                    </div>

                    {/* Metadata Specs */}
                    <div className="space-y-3 bg-rose-50/60 border border-rose-100 rounded-2xl p-4 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-rose-600" /> Durée par round :
                        </span>
                        <span className="font-mono text-stone-900 font-semibold">{session.durationRoundMin} min</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Total de rounds :
                        </span>
                        <span className="font-mono text-stone-900 font-semibold">{session.totalRounds} binômes</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-rose-600" /> Places occupées :
                        </span>
                        <span className="font-mono text-stone-900 font-semibold">
                          {isBooked ? session.currentParticipants + 1 : session.currentParticipants} / {session.maxParticipants}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Action Buttons */}
                  {session.status === "LIVE" ? (
                    <Link href={`/live/${session.id}`} className="w-full">
                      <Button variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Rejoindre le Live
                      </Button>
                    </Link>
                  ) : isBooked ? (
                    <Link href={`/waiting-room/${session.id}`} className="w-full">
                      <Button variant="accent" fullWidth leftIcon={<CheckCircle2 className="w-4 h-4 text-white" />}>
                        Entrer en Salle d'Attente
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleOpenPayment(session)}
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Payer & Réserver ({session.price} €)
                    </Button>
                  )}

                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Security Reassurance Banner */}
      <div className="mt-20 p-8 bg-white border border-rose-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_-10px_rgba(225,29,72,0.08)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-base">Garantie de Sécurité & Paiement Stripe Oweke</h4>
            <p className="text-xs text-stone-600 max-w-xl">
              Toutes les transactions bancaires sont sécurisées par Stripe avec chiffrement SSL 256 bits. Vos accès au salon live sont garantis dès la validation de votre paiement.
            </p>
          </div>
        </div>
        <Badge variant="success">Stripe Verified</Badge>
      </div>

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        session={selectedSessionForPayment}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
