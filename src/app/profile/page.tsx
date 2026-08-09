"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Save,
  CheckCircle2,
  User,
  Sliders,
  Sparkles,
  Heart,
  Video,
  Mic,
  Plus,
  X,
  MapPin,
  Briefcase,
  ShieldCheck,
  Award,
  Globe,
  MessageSquare
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import WebcamPreview from "@/components/live/WebcamPreview";
import { soundEffects } from "@/utils/soundEffects";

const AVAILABLE_INTERESTS = [
  "Voyage ✈️",
  "Gastronomie 🍷",
  "Musique Live 🎵",
  "Fitness & Sport 🏋️‍♂️",
  "Cinéma & Séries 🎬",
  "Lecture 📚",
  "Randonnée 🏔️",
  "Art & Expo 🎨",
  "Rooftop & Cocktails 🍸",
  "High-Tech 💻",
  "Cuisine du monde 🍜",
  "Théâtre & Comedy 🎭",
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"INFO" | "PREFS" | "INTERESTS" | "PROMPTS" | "MEDIA">("INFO");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Profile Form States
  const [name, setName] = useState("Alexandre");
  const [age, setAge] = useState<number>(29);
  const [city, setCity] = useState("Paris (75011)");
  const [profession, setProfession] = useState("Architecte d'Intérieur");
  const [height, setHeight] = useState("1m82");
  const [bio, setBio] = useState("Passionné par le design, les voyages improvisés en Italie et les dîners entre amis. À la recherche de belles connexions authentiques.");
  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80");

  // Match Preferences
  const [minAge, setMinAge] = useState<number>(24);
  const [maxAge, setMaxAge] = useState<number>(35);
  const [maxDistance, setMaxDistance] = useState<number>(30); // km
  const [relationshipType, setRelationshipType] = useState("Relation sérieuse et durable");

  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Voyage ✈️",
    "Gastronomie 🍷",
    "Rooftop & Cocktails 🍸",
    "Art & Expo 🎨",
  ]);
  const [customInterest, setCustomInterest] = useState("");

  // Icebreaker Answers
  const [idealDatePrompt, setIdealDatePrompt] = useState("Un verre en rooftop au coucher du soleil suivi d'une balade nocturne.");
  const [dreamDestinationPrompt, setDreamDestinationPrompt] = useState("Un road trip en Toscane ou au Japon au printemps.");

  // Media Test States
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  // Load Saved Data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oweke_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.age) setAge(parsed.age);
        if (parsed.city) setCity(parsed.city);
        if (parsed.profession) setProfession(parsed.profession);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.selectedInterests) setSelectedInterests(parsed.selectedInterests);
      }
    } catch {
      // Fallback to default state
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const profileData = {
      name,
      age,
      city,
      profession,
      height,
      bio,
      photoUrl,
      minAge,
      maxAge,
      maxDistance,
      relationshipType,
      selectedInterests,
      idealDatePrompt,
      dreamDestinationPrompt,
    };

    try {
      localStorage.setItem("oweke_user_profile", JSON.stringify(profileData));
    } catch {
      // Ignored
    }

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      soundEffects.playRoundStart();

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 800);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const handleAvatarChange = () => {
    // Simulate photo update with preset high quality portrait
    const sampleAvatars = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    ];
    const nextPhoto = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setPhotoUrl(nextPhoto);
  };

  // Calculate completion percentage
  const completionPercentage = Math.min(
    100,
    (name ? 20 : 0) +
      (age ? 15 : 0) +
      (city ? 15 : 0) +
      (bio ? 20 : 0) +
      (selectedInterests.length >= 3 ? 15 : 0) +
      (idealDatePrompt ? 15 : 0)
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(5,150,105,0.4)] border border-emerald-400/40 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="font-bold text-xs uppercase tracking-wider">Profil Enregistré avec Succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Profile Banner Card */}
      <GlassCard className="p-6 md:p-8 mb-8 relative overflow-hidden">
        {/* Glow Ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Avatar Upload Container */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative"
            >
              {/* eslint-disable-next-html-element-walkaround */}
              <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Change Avatar Button Overlay */}
            <button
              onClick={handleAvatarChange}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300 border-4 border-transparent"
              title="Changer la photo de profil"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-mono uppercase font-bold">Modifier</span>
            </button>

            <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white" title="Profil en ligne">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* User Details Overview */}
          <div className="text-center md:text-left flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1c1917] tracking-tight">
                {name}, {age} ans
              </h1>
              <Badge variant="accent" className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-white" /> Profil 100% Vérifié VIP
              </Badge>
            </div>

            <p className="text-xs text-stone-600 font-medium flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> {city} • <Briefcase className="w-3.5 h-3.5 text-purple-600" /> {profession}
            </p>

            {/* Completion Progress Bar */}
            <div className="pt-2 max-w-sm">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 mb-1">
                <span>Complétion du profil</span>
                <span className="font-bold text-rose-600">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden border border-rose-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-600 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Profile Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-rose-900/10 pb-4 mb-6">
        {[
          { id: "INFO", label: "Infos Personnelles", icon: User },
          { id: "PREFS", label: "Préférences Match", icon: Sliders },
          { id: "INTERESTS", label: "Passions & Intérêts", icon: Sparkles },
          { id: "PROMPTS", label: "Questions Brise-Glace", icon: MessageSquare },
          { id: "MEDIA", label: "Test Caméra & Micro", icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-rose-600 text-white font-bold shadow-md scale-105"
                  : "bg-white/80 hover:bg-white text-stone-600 border border-rose-200/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave}>
        <GlassCard className="p-6 md:p-8">
          
          {/* TAB 1: Personal Info */}
          {activeTab === "INFO" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-[#1c1917] border-b border-rose-900/10 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-600" /> Vos Informations de Présentation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">Prénom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">Âge</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    min={18}
                    max={99}
                    required
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">Ville / Localisation</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Ex: Paris (75011)"
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Ex: Designer, Ingénieur, Avocat..."
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">Taille (cm)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ex: 1m78"
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                  Bio Courte (présentée lors de la phase Soft View)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Décrivez votre état d'esprit, ce que vous aimez dans la vie et ce que vous recherchez..."
                  className="w-full bg-white border border-rose-200 rounded-2xl p-4 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: Match Preferences */}
          {activeTab === "PREFS" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-[#1c1917] border-b border-rose-900/10 pb-3 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-600" /> Vos Critères de Rencontre & Filtres Fast-Date
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                    Tranche d'âge recherchée : <span className="text-rose-600">{minAge} - {maxAge} ans</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={18}
                      max={60}
                      value={minAge}
                      onChange={(e) => setMinAge(Math.min(parseInt(e.target.value), maxAge - 1))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <input
                      type="range"
                      min={18}
                      max={70}
                      value={maxAge}
                      onChange={(e) => setMaxAge(Math.max(parseInt(e.target.value), minAge + 1))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                    Rayon géographique maximum : <span className="text-rose-600">{maxDistance} km</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={150}
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">Intention de Rencontre</label>
                  <select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-sm font-medium text-[#1c1917] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
                  >
                    <option value="Relation sérieuse et durable">Relation sérieuse et durable</option>
                    <option value="Laisser faire la chimie et voir">Laisser faire la chimie et voir</option>
                    <option value="Rencontres amicales & réseau">Rencontres amicales & réseau</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Passions & Interests */}
          {activeTab === "INTERESTS" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-[#1c1917] border-b border-rose-900/10 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" /> Vos Centres d'Intérêt & Passions
              </h2>

              <p className="text-xs text-stone-600">
                Sélectionnez vos thèmes favoris. Ces badges seront affichés en aperçu lors des rounds vidéo.
              </p>

              {/* Tag Grid */}
              <div className="flex flex-wrap gap-2.5">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md scale-105"
                          : "bg-rose-50/80 hover:bg-rose-100 text-stone-700 border border-rose-200"
                      }`}
                    >
                      {interest}
                      {isSelected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tag Input */}
              <div className="pt-4 border-t border-rose-900/10">
                <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                  Ajouter une passion sur mesure
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="Ex: Astronomie 🌌, Musique classique 🎻"
                    className="flex-1 bg-white border border-rose-200 rounded-2xl px-4 py-2.5 text-xs text-[#1c1917] focus:outline-none focus:border-rose-600"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCustomInterest}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Prompts */}
          {activeTab === "PROMPTS" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-[#1c1917] border-b border-rose-900/10 pb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" /> Réponses aux Sujets Brise-Glace
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                    Le rendez-vous parfait selon moi...
                  </label>
                  <input
                    type="text"
                    value={idealDatePrompt}
                    onChange={(e) => setIdealDatePrompt(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-xs text-[#1c1917] focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 font-bold mb-2">
                    Ma destination de rêve pour demain...
                  </label>
                  <input
                    type="text"
                    value={dreamDestinationPrompt}
                    onChange={(e) => setDreamDestinationPrompt(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 text-xs text-[#1c1917] focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: Media & Webcam Test */}
          {activeTab === "MEDIA" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-[#1c1917] border-b border-rose-900/10 pb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-600" /> Testeur de Caméra & Microphone en Direct
              </h2>

              <p className="text-xs text-stone-600">
                Assurez-vous que votre éclairage et votre micro fonctionnent parfaitement avant de rejoindre votre première session live.
              </p>

              {/* Webcam Test Container */}
              <div className="h-72 w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-xl border border-rose-200">
                <WebcamPreview
                  micActive={micActive}
                  videoActive={videoActive}
                  onToggleMic={() => setMicActive(!micActive)}
                  onToggleVideo={() => setVideoActive(!videoActive)}
                />
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setMicActive(!micActive)} leftIcon={<Mic className="w-4 h-4" />}>
                  {micActive ? "Micro Actif" : "Micro Coupé"}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setVideoActive(!videoActive)} leftIcon={<Video className="w-4 h-4" />}>
                  {videoActive ? "Caméra Active" : "Caméra Coupée"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Bottom Action Save Button */}
          <div className="pt-8 border-t border-rose-900/10 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
              leftIcon={
                isSaving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Save className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSaving ? "Enregistrement..." : "Sauvegarder mon Profil"}
            </Button>
          </div>

        </GlassCard>
      </form>
    </div>
  );
}
