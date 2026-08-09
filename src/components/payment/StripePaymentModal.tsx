"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, ShieldCheck, CheckCircle2, X, Sparkles, Smartphone } from "lucide-react";
import Button from "../ui/Button";
import { Session } from "@/types";
import { soundEffects } from "@/utils/soundEffects";

interface StripePaymentModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (sessionId: string) => void;
}

export default function StripePaymentModal({
  session,
  isOpen,
  onClose,
  onPaymentSuccess,
}: StripePaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "APPLE_PAY">("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!isOpen || !session) return null;

  // Format Card Number (4242 4242 4242 4242)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 3D Secure / Stripe API verification delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      soundEffects.playMatchFanfare();

      setTimeout(() => {
        onPaymentSuccess(session.id);
        onClose();
      }, 1800);
    }, 1500);
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
          className="relative max-w-md w-full bg-[#0d0d14] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(244,63,94,0.3)] text-left my-auto overflow-hidden"
        >
          {/* Ambient Lighting Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stripe Badge Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                Paiement Sécurisé Stripe
              </span>
              <span className="text-xs text-white/50">Chiffrement SSL 256 bits</span>
            </div>
          </div>

          {!paymentComplete ? (
            <>
              {/* Order Summary Box */}
              <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{session.title}</h4>
                    <p className="text-xs text-white/60">{session.date} à {session.time} • {session.department}</p>
                  </div>
                  <span className="text-lg font-bold text-rose-400">{session.price},00 €</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px] font-mono text-white/50">
                  <span>Pass accès salon VIP (8 rounds max)</span>
                  <span>TVA incluse</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "CARD"
                      ? "bg-rose-600 text-white border-rose-500 shadow-md"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Carte Bancaire
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("APPLE_PAY")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "APPLE_PAY"
                      ? "bg-white text-black border-white shadow-md font-bold"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Apple / Google Pay
                </button>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                {paymentMethod === "CARD" ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/70 mb-1 font-semibold">
                        Nom sur la carte
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Alexandre Dupont"
                        required
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/70 mb-1 font-semibold">
                        Numéro de carte bancaire
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          required
                          className="w-full bg-black/60 border border-white/15 rounded-xl pl-4 pr-10 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                        />
                        <CreditCard className="w-4 h-4 text-white/40 absolute right-3 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-white/70 mb-1 font-semibold">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="12/28"
                          required
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-white/70 mb-1 font-semibold">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                          placeholder="123"
                          required
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-3">
                    <Smartphone className="w-10 h-10 text-white/80 mx-auto" />
                    <p className="text-xs text-white/80">
                      Paiement instantané via Apple Pay ou Google Pay sur votre appareil.
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="accent"
                    fullWidth
                    size="lg"
                    disabled={isProcessing}
                    leftIcon={
                      isProcessing ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Lock className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )
                    }
                  >
                    {isProcessing ? "Validation Stripe en cours..." : `Payer ${session.price},00 € & Réserver`}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transaction sécurisée par Stripe • Satisfait ou remboursé</span>
                </div>
              </form>
            </>
          ) : (
            /* Payment Success View */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Paiement Validé !</h3>
              <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                Votre billet d'accès pour <span className="font-semibold text-white">{session.title}</span> est débloqué. Redirection vers la salle d'attente...
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
