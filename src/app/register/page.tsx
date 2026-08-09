"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, User, MapPin, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { soundEffects } from "@/utils/soundEffects";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<number>(26);
  const [city, setCity] = useState("Paris (75011)");
  const [gender, setGender] = useState("FEMALE");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handleFinalRegister();
    }
  };

  const handleFinalRegister = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setRegisterSuccess(true);
      soundEffects.playMatchFanfare();

      try {
        localStorage.setItem("oweke_user_profile", JSON.stringify({
          name,
          email,
          age,
          city,
          gender,
          registeredAt: new Date().toISOString(),
        }));
      } catch {
        // Ignored
      }

      setTimeout(() => {
        router.push("/sessions");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-md mx-auto flex flex-col justify-center">
      {/* Glow Ambient Soft Lights */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-r from-rose-200/60 via-purple-200/50 to-amber-100/40 rounded-full blur-[120px] pointer-events-none" />

      <GlassCard className="p-8 relative z-10 space-y-6 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.15)]">
        
        {/* Step Counter */}
        <div className="flex items-center justify-between border-b border-rose-900/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-outfit font-black text-lg uppercase tracking-tight text-stone-900">OWEKE</span>
          </div>
          <Badge variant="primary">Étape {step} / 2</Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-[#1c1917] tracking-tight">
            {step === 1 ? "Créer votre Compte" : "Votre Profil de Rencontre"}
          </h1>
          <p className="text-xs text-stone-600 font-light">
            {step === 1
              ? "Rejoignez le salon de Fast Dating vidéo en 1 minute"
              : "Quelques critères pour calibrer vos binômes vidéo"}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleNextStep} className="space-y-4">
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1.5">
                  Prénom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Camille"
                    required
                    className="w-full bg-white border border-rose-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1.5">
                  Adresse Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="camille@example.com"
                    required
                    className="w-full bg-white border border-rose-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1.5">
                  Mot de passe (8 caractères min.)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    className="w-full bg-white border border-rose-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1.5">
                  Âge (18 ans révolus requis)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  min={18}
                  max={99}
                  required
                  className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1.5">
                  Ville / Département
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paris (75011)"
                    required
                    className="w-full bg-white border border-rose-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>
                    J'accepte les CGU et m'engage à respecter la charte de bienveillance et de respect visio Oweke.
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          <div className="pt-2 flex gap-3">
            {step === 2 && (
              <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                Retour
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={isLoading || registerSuccess}
              rightIcon={
                registerSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )
              }
            >
              {registerSuccess
                ? "Compte Créé avec Succès !"
                : isLoading
                ? "Création..."
                : step === 1
                ? "Étape Suivante ➔"
                : "Terminer & Voir les Sessions"}
            </Button>
          </div>
        </form>

        {/* Footer Switch to Login */}
        <div className="pt-4 border-t border-rose-900/10 text-center text-xs text-stone-600">
          Déjà membre Oweke ?{" "}
          <Link href="/login" className="font-bold text-rose-600 hover:underline">
            Se connecter
          </Link>
        </div>

      </GlassCard>
    </div>
  );
}
