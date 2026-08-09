"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Video, 
  Star,
  ChevronDown,
  Flame,
  CheckCircle2,
  Lock,
  Mic,
  Video as VideoIcon,
  ShieldAlert,
  EyeOff,
  Zap,
  RefreshCw
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f5] text-[#1c1917] selection:bg-rose-500/20">
      
      {/* 
        ========================================
        HERO SECTION (Image-Rich, Interactive Showcase)
        ======================================== 
      */}
      <section className="relative pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Glow Ambient Soft Lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-rose-200/50 via-amber-200/40 to-purple-200/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-rose-300/60 shadow-[0_4px_20px_rgba(225,29,72,0.08)]">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="text-xs font-mono text-rose-900 tracking-wider uppercase font-semibold">
                142 Célibataires Connectés • Prochaine Session à 20h30
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-stone-900">
              De vraies rencontres.<br />
              <span className="text-gradient-rose">
                En visio. En 5 minutes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-stone-600 font-light max-w-xl leading-relaxed">
              Fini le swipe infini et les conversations mortes par chat. Rejoignez des soirées de speed dating vidéo organisées par région et tranche d'âge, en direct depuis votre salon.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/sessions" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Trouver ma Session Ce Soir
                </Button>
              </Link>
              <Link href="#comment-ca-marche" className="w-full sm:w-auto">
                <Button variant="glass" size="lg" fullWidth>
                  Comment ça marche ?
                </Button>
              </Link>
            </div>

            {/* Key Value Badges */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-mono font-medium">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Profils 100% Vérifiés
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" /> Flux Visio 100% Éphémère
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> Note 4.9/5 (1.2k+ matchs)
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Image & Live Video Mockup Showcase */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Interactive Live Visio Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white/90 border border-rose-200/80 rounded-3xl p-4 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.18)] overflow-hidden"
            >
              {/* Header inside Mockup */}
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-rose-100 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-stone-800 uppercase tracking-wider">Round 2 / 6 • 04:32</span>
                </div>
                <Badge variant="live">EN DIRECT</Badge>
              </div>

              {/* Twin Video Photo Grid Showcase */}
              <div className="grid grid-cols-2 gap-3 h-64 md:h-72">
                
                {/* Participant A */}
                <div className="relative rounded-2xl overflow-hidden border border-rose-200 shadow-md group">
                  {/* eslint-disable-next-html-element-walkaround */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                    alt="Camille"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-left">
                    <span className="font-bold text-white text-sm block">Camille, 28</span>
                    <span className="text-[10px] text-white/80 font-mono">Paris 11e</span>
                  </div>
                </div>

                {/* Participant B */}
                <div className="relative rounded-2xl overflow-hidden border border-rose-200 shadow-md group">
                  {/* eslint-disable-next-html-element-walkaround */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                    alt="Lucas"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-left">
                    <span className="font-bold text-white text-sm block">Lucas, 30</span>
                    <span className="text-[10px] text-white/80 font-mono">Boulogne</span>
                  </div>
                </div>

              </div>

              {/* Bottom Control Bar inside Mockup */}
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-rose-100 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <VideoIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                  <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                  <span>Soft View dans 4 min</span>
                </div>
              </div>

            </motion.div>

            {/* Floating Interactive Match Badge Card 1 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-20 bg-white border border-rose-200 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-400">
                {/* eslint-disable-next-html-element-walkaround */}
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
                  alt="Sophie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-xs font-bold text-stone-900">
                  <span>Match Réciproque !</span>
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                </div>
                <span className="text-[10px] text-stone-500 font-mono">Sophie & Alexandre</span>
              </div>
            </motion.div>

            {/* Floating Interactive Notification Card 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-4 z-20 bg-white border border-rose-200 p-3.5 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 block">Session Paris 25-35 ans</span>
                <span className="text-[10px] text-emerald-600 font-mono font-semibold">14 / 16 Inscrits • Complet à 90%</span>
              </div>
            </motion.div>

          </div>

        </div>

      </section>

      {/* 
        ========================================
        SECTION 1: COMMENT ÇA MARCHE ? (3 Steps)
        ======================================== 
      */}
      <section id="comment-ca-marche" className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-rose-900/10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="primary">Simplicité & Authenticité</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900">Comment fonctionne une soirée Oweke ?</h2>
          <p className="text-stone-600 text-sm md:text-base font-light">
            Une expérience fluide conçue pour vous faire gagner du temps et vous offrir une vraie connexion humaine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {[
            {
              step: "01",
              title: "Choisissez votre Session",
              desc: "Sélectionnez votre région (Paris, Lyon, Marseille...) et la tranche d'âge qui vous correspond. Réservez votre place en 1 clic.",
              icon: Calendar,
              color: "bg-white",
              border: "border-rose-200"
            },
            {
              step: "02",
              title: "Rencontrez en Visio (5 min)",
              desc: "Le soir J, connectez-vous. Notre algorithme vous met automatiquement en binôme pour 6 à 8 dates vidéo de 5 minutes chacun.",
              icon: Video,
              color: "bg-white",
              border: "border-purple-200"
            },
            {
              step: "03",
              title: "Votez & Matchez !",
              desc: "Après chaque date, indiquez confidentiellement si vous avez eu un Coup de Cœur. En cas de choix réciproque, vos contacts sont débloqués !",
              icon: Heart,
              color: "bg-white",
              border: "border-amber-200"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className={`h-full ${item.color} border ${item.border} rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-[0_15px_35px_-10px_rgba(225,29,72,0.06)] group hover:-translate-y-2 transition-all duration-300`}>
                <span className="font-mono text-4xl font-extrabold text-rose-200 block">{item.step}</span>
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}

        </div>

      </section>

      {/* 
        ========================================
        SECTION 2: PROCHAINES SESSIONS CE SOIR
        ======================================== 
      */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-white/60 border border-rose-200/60 rounded-3xl my-12 shadow-[0_15px_40px_-15px_rgba(225,29,72,0.08)]">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <Badge variant="live" pulse={true} className="mb-3">Événements en Direct</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">Prochaines Soirées de Speed Dating</h2>
          </div>
          <Link href="/sessions">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Voir toutes les sessions
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {[
            {
              city: "Paris & Île-de-France",
              age: "25-35 ans",
              time: "Ce soir • 20h30",
              spots: "2 places restantes",
              price: "15 €",
              badge: "EN DIRECT BIENTÔT"
            },
            {
              city: "Lyon & Rhône",
              age: "30-42 ans",
              time: "Ce soir • 21h00",
              spots: "4 places restantes",
              price: "15 €",
              badge: "REMPLISSAGE FAST"
            },
            {
              city: "Marseille & PACA",
              age: "28-40 ans",
              time: "Demain • 20h00",
              spots: "6 places restantes",
              price: "12 €",
              badge: "OUVERT"
            }
          ].map((session, i) => (
            <GlassCard key={i} glowColor="pink" className="space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="live">{session.badge}</Badge>
                  <span className="font-bold text-rose-600 text-lg">{session.price}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-1">{session.city}</h3>
                <p className="text-xs text-stone-500 font-mono mb-4">{session.age}</p>
                
                <div className="space-y-2 text-xs text-stone-700 bg-rose-50/60 border border-rose-100 p-3 rounded-2xl">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-rose-600" /> Horaires :</span>
                    <span className="font-semibold text-stone-900">{session.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-rose-600" /> Disponibilité :</span>
                    <span className="font-semibold text-emerald-700">{session.spots}</span>
                  </div>
                </div>
              </div>

              <Link href="/sessions" className="w-full block">
                <Button variant="primary" fullWidth size="sm">
                  Réserver ma Place
                </Button>
              </Link>
            </GlassCard>
          ))}

        </div>

      </section>

      {/* 
        ========================================
        SECTION 3: SÉCURITÉ & EXPÉRIENCE SANS FRICTION
        ======================================== 
      */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="accent">Confidentialité & Protection</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-stone-900">
              Un environnement 100% sécurisé & bienveillant.
            </h2>
            <p className="text-stone-600 text-base leading-relaxed font-light">
              Votre sécurité et votre confort sont nos priorités absolues. Chaque session intègre des outils d'urgence et une modération automatique pour garantir des échanges respectueux et agréables.
            </p>

            <div className="space-y-4 pt-2">
              {[
                "Transmission vidéo de bout en bout (aucun enregistrement conservé)",
                "Bouton de floutage d'urgence instantané en 1 clic durant le round",
                "Signalement anonyme et exclusion immédiate des profils irrespectueux",
                "Matchs réciproques confidentiels : vos coordonnées restent protégées"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-stone-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/sessions">
                <Button variant="glass" rightIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}>
                  En savoir plus sur nos garanties
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <GlassCard glowColor="purple" className="p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-sm">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-stone-900">Centre de Sécurité Oweke</h4>
                  <p className="text-xs text-rose-700 font-mono font-medium">Algorithme de Rotation & Protection Directe</p>
                </div>
              </div>
              <blockquote className="text-sm text-stone-700 italic leading-relaxed">
                "Notre système orchestre automatiquement les salons vidéo Agora RTC et Socket.io pour que vous n'ayez qu'à vous concentrer sur vos échanges. Rien n'est enregistré, tout se vit en direct."
              </blockquote>
            </GlassCard>
          </div>

        </div>
      </section>

      {/* 
        ========================================
        SECTION 4: TÉMOIGNAGES & HISTOIRES DE RÉUSSITE
        ======================================== 
      */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-rose-900/10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="primary">Histoires Réelles</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">Ils se sont rencontrés sur Oweke</h2>
          <p className="text-stone-600 text-sm font-light">
            Découvrez les témoignages de couples qui ont trouvé l'étincelle lors d'une session vidéo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {[
            {
              names: "Thomas & Marie (32 & 29 ans)",
              city: "Paris",
              text: "On en avait marre des swipes sans réponse. En 5 minutes de vidéo lors de la session Paris 25-35 ans, on a ri tout de suite. Ça fait 8 mois qu'on est ensemble !",
              photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
            },
            {
              names: "Julien & Sarah (35 & 33 ans)",
              city: "Lyon",
              text: "Le format en rotation de 5 minutes est génial : pas le temps de s'ennuyer. Dès le Round 3 avec Sarah, le feeling est passé immédiatement. Merci Oweke !",
              photo: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=600&q=80"
            }
          ].map((couple, idx) => (
            <GlassCard key={idx} glowColor="pink" className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-500 shadow-md">
                  {/* eslint-disable-next-html-element-walkaround */}
                  <img src={couple.photo} alt={couple.names} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">{couple.names}</h4>
                  <p className="text-xs text-stone-500">{couple.city}</p>
                </div>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed font-light italic">
                "{couple.text}"
              </p>
            </GlassCard>
          ))}

        </div>

      </section>

      {/* 
        ========================================
        SECTION 5: FAQ (Foire Aux Questions)
        ======================================== 
      */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto border-t border-rose-900/10">
        
        <div className="text-center mb-16 space-y-3">
          <Badge variant="outline">Questions Fréquentes</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">Tout ce que vous devez savoir</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Les sessions vidéo sont-elles enregistrées ?",
              a: "Absolument pas. Tous les flux vidéo sont transmis en direct de bout en bout via WebRTC sécurisé et ne sont jamais enregistrés sur aucun serveur."
            },
            {
              q: "Comment fonctionnent les matchs ?",
              a: "À la fin de chaque date de 5 minutes, vous avez 15 secondes (Soft View) pour voter confidentiellement (Coup de Cœur ou Passer). En cas de vote positif réciproque, vos coordonnées sont débloquées."
            },
            {
              q: "Que se passe-t-il en cas de comportement inapproprié ?",
              a: "Votre sécurité est notre priorité absolue. Un bouton d'alerte et de modération en 1 clic permet de flouter l'écran et de signaler tout utilisateur indésirable."
            },
            {
              q: "Puis-je participer depuis mon smartphone ?",
              a: "Oui ! Le site web Oweke est 100% responsive et fonctionne parfaitement sur tous les navigateurs web (Safari, Chrome) sur mobile comme sur ordinateur."
            }
          ].map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFaq(index)}
              className="bg-white border border-rose-200 hover:border-rose-400 rounded-2xl p-6 cursor-pointer shadow-sm transition-all"
            >
              <div className="flex justify-between items-center gap-4">
                <h4 className="font-bold text-base text-stone-900">{faq.q}</h4>
                <ChevronDown className={`w-5 h-5 text-rose-600 transition-transform ${activeFaq === index ? "rotate-180" : ""}`} />
              </div>
              {activeFaq === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs md:text-sm text-stone-600 pt-4 leading-relaxed font-light"
                >
                  {faq.a}
                </motion.p>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* 
        ========================================
        FOOTER (Chaleureux & Complet)
        ======================================== 
      */}
      <footer className="pt-20 pb-12 px-4 md:px-8 border-t border-rose-200 bg-[#f7f2ec]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-outfit font-black text-2xl tracking-tighter uppercase text-stone-900">
                OWEKE<span className="text-rose-600">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 max-w-sm leading-relaxed font-light">
              La plateforme de speed dating vidéo en rotation directe. Des rencontres réelles, chaleureuses et authentiques depuis chez vous.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-rose-700 tracking-wider mb-4 font-bold">Plateforme</h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li><Link href="/sessions" className="hover:text-stone-900 transition-colors">Sessions Live</Link></li>
              <li><Link href="/matches" className="hover:text-stone-900 transition-colors">Mes Matchs</Link></li>
              <li><Link href="/profile" className="hover:text-stone-900 transition-colors">Mon Profil</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-rose-700 tracking-wider mb-4 font-bold">Légal & Sécurité</h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li><Link href="#" className="hover:text-stone-900 transition-colors">Confidentialité & RGPD</Link></li>
              <li><Link href="#" className="hover:text-stone-900 transition-colors">Conditions Générales (CGU)</Link></li>
              <li><Link href="#" className="hover:text-stone-900 transition-colors">Charte de Bienveillance</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-300/60 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-stone-500">
          <span>© 2026 OWEKE Fast Date. Tous droits réservés.</span>
          <span className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Service Opérationnel
          </span>
        </div>
      </footer>

    </div>
  );
}
