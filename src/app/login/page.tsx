"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { soundEffects } from "@/utils/soundEffects";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login verification
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      soundEffects.playRoundStart();

      try {
        localStorage.setItem("oweke_user_session", JSON.stringify({
          email,
          token: "jwt_token_demo_oweke_2026",
          loggedInAt: new Date().toISOString(),
        }));
      } catch {
        // Ignored
      }

      setTimeout(() => {
        router.push("/sessions");
      }, 1200);
    }, 900);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      soundEffects.playRoundStart();
      setTimeout(() => {
        router.push("/sessions");
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-md mx-auto flex flex-col justify-center">
      {/* Glow Ambient Soft Lights */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-r from-rose-200/60 via-purple-200/50 to-amber-100/40 rounded-full blur-[120px] pointer-events-none" />

      <GlassCard className="p-8 relative z-10 space-y-6 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.15)]">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center mx-auto shadow-md mb-3">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1c1917] tracking-tight">
            Connexion Salon Oweke
          </h1>
          <p className="text-xs text-stone-600 font-light">
            Retrouvez vos sessions live et vos matchs réciproques
          </p>
        </div>

        {/* Google OAuth Quick Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold text-stone-800 flex items-center justify-center gap-3 transition-all shadow-xs active:scale-98"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continuer avec Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-stone-200 flex-1" />
          <span className="text-[10px] font-mono uppercase text-stone-400">ou par email</span>
          <div className="h-px bg-stone-200 flex-1" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexandre@example.com"
                required
                className="w-full bg-white border border-rose-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono uppercase text-stone-600 font-bold">
                Mot de passe
              </label>
              <Link href="#" className="text-[11px] font-mono text-rose-600 hover:underline">
                Oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-rose-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Se souvenir de moi</span>
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={isLoading || loginSuccess}
              rightIcon={
                loginSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )
              }
            >
              {loginSuccess ? "Connexion Réussie !" : isLoading ? "Vérification..." : "Entrer dans le Salon"}
            </Button>
          </div>
        </form>

        {/* Footer Switch to Register */}
        <div className="pt-4 border-t border-rose-900/10 text-center text-xs text-stone-600">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-bold text-rose-600 hover:underline">
            Créer un compte
          </Link>
        </div>

      </GlassCard>
    </div>
  );
}
