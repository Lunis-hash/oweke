"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ShieldCheck,
  Heart,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Square,
  ShieldAlert,
  EyeOff,
  Activity,
  Volume2,
  Tag
} from "lucide-react";
import { Participant } from "@/types";
import Badge from "../ui/Badge";
import WebcamPreview from "./WebcamPreview";
import IcebreakerCard from "./IcebreakerCard";
import LiveReactions from "./LiveReactions";
import SafetyReportModal from "./SafetyReportModal";

interface VideoGridProps {
  partner: Participant | null;
  roundNumber: number;
  totalRounds: number;
  onQuickRate?: (liked: boolean) => void;
}

export default function VideoGrid({ partner, roundNumber, totalRounds, onQuickRate }: VideoGridProps) {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"GRID" | "PIP">("GRID");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen bg-[#050508] p-4 flex flex-col justify-between"
          : "h-[75vh] max-h-[820px] bg-[#050508] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between p-4 md:p-6"
      }`}
    >
      {/* Top Overlay Bar */}
      <div className="relative z-20 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <Badge variant="live" pulse={true}>
            ROUND {roundNumber} / {totalRounds}
          </Badge>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-white/70">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px]">12ms • HD 1080p • Stable</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Mode Switch */}
          <button
            onClick={() => setLayoutMode(layoutMode === "GRID" ? "PIP" : "GRID")}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors"
            title="Changer la disposition des caméras"
          >
            {layoutMode === "GRID" ? <Square className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors"
            title="Mode Plein écran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Security Modal Launcher */}
          <button
            onClick={() => setSafetyModalOpen(true)}
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs text-rose-300 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline font-mono text-[10px] uppercase">Sécurité</span>
          </button>
        </div>
      </div>

      {/* Video Windows Grid Layout */}
      <div
        className={`absolute inset-0 z-0 p-4 pt-16 pb-24 transition-all duration-500 ${
          layoutMode === "GRID"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
            : "relative"
        }`}
      >
        {/* Partner Video View (Primary) */}
        <div
          className={`relative w-full h-full bg-[#0a0a0f] rounded-2xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center group ${
            isScreenBlurred ? "filter blur-2xl" : ""
          }`}
        >
          {partner ? (
            <>
              {/* Partner Video Simulation Background */}
              {/* eslint-disable-next-html-element-walkaround */}
              <img
                src={partner.photoUrl}
                alt={partner.name}
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Partner Audio Wave Visualizer Simulation */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 uppercase">En ligne</span>
              </div>

              {/* Partner Info Overlay & Common Tags */}
              <div className="absolute bottom-4 left-4 z-10 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {partner.name}, {partner.age}
                  </h2>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-white/70 font-light">{partner.city}</p>

                {/* Common Passions Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-white/10 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5 text-rose-400" /> Voyager
                  </span>
                  <span className="text-[10px] bg-white/10 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5 text-purple-400" /> Gastronomie
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 animate-spin">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-mono text-white/60">Connexion au binôme en cours...</p>
            </div>
          )}
        </div>

        {/* Self Video View (Supports PIP vs Side-by-Side) */}
        <div
          className={
            layoutMode === "GRID"
              ? "relative w-full h-full"
              : "absolute bottom-28 right-8 z-30 w-48 h-64 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300"
          }
        >
          <WebcamPreview
            micActive={micActive}
            videoActive={videoActive}
            onToggleMic={() => setMicActive(!micActive)}
            onToggleVideo={() => setVideoActive(!videoActive)}
            isBlurred={isScreenBlurred}
          />
        </div>
      </div>

      {/* Bottom Floating Toolbar (Icebreakers + Media Controls + Reactions) */}
      <div className="relative z-30 flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
        {/* Icebreaker Questions Drawer Launcher */}
        <IcebreakerCard />

        {/* Media Control Buttons */}
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-2xl border border-white/20 px-6 py-2.5 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMicActive(!micActive)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              micActive ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-600 text-white shadow-lg"
            }`}
            title={micActive ? "Couper le micro" : "Activer le micro"}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVideoActive(!videoActive)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              videoActive ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-600 text-white shadow-lg"
            }`}
            title={videoActive ? "Desactiver la caméra" : "Activer la caméra"}
          >
            {videoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </motion.button>

          {/* Quick Screen Blur Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScreenBlurred(!isScreenBlurred)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isScreenBlurred ? "bg-amber-500 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Masquer / Flouter mon flux vidéo"
          >
            <EyeOff className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Live Emojis Reaction Bar */}
        <LiveReactions />
      </div>

      {/* Safety Report Modal */}
      <SafetyReportModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        onBlurScreenToggle={() => setIsScreenBlurred(!isScreenBlurred)}
        isScreenBlurred={isScreenBlurred}
      />
    </div>
  );
}
