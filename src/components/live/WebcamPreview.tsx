"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Camera, User, Sparkles, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface WebcamPreviewProps {
  micActive: boolean;
  videoActive: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  isBlurred?: boolean;
}

export default function WebcamPreview({
  micActive,
  videoActive,
  onToggleMic,
  onToggleVideo,
  isBlurred = false,
}: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Initialize MediaStream on Mount
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animId: number;

    async function initCamera() {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) {
          setHasPermission(false);
          return;
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        setHasPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Set up Audio Volume Analyzer
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaStreamSource(mediaStream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (analyser) {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
            }
            animId = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        }
      } catch (err) {
        console.warn("Webcam access restricted or denied:", err);
        setHasPermission(false);
      }
    }

    initCamera();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  // Update Track Enabled States
  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = videoActive;
      });
    }
  }, [videoActive, stream]);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = micActive;
      });
    }
  }, [micActive, stream]);

  return (
    <div className="relative w-full h-full bg-[#09090e] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center group shadow-inner">
      {/* Real Video Stream */}
      {videoActive && hasPermission ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted // Mute local preview audio to prevent feedback loop
            className={`w-full h-full object-cover transform -scale-x-100 transition-all duration-300 ${
              isBlurred ? "blur-xl scale-105" : ""
            }`}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Volume Indicator Meter */}
          {micActive && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center gap-0.5 h-3">
                {[20, 40, 60, 80].map((threshold, idx) => (
                  <span
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      audioLevel >= threshold ? "bg-emerald-400 h-3" : "bg-white/20 h-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-[11px] font-mono font-medium text-white/90 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Votre Caméra (HD 1080p)
            </span>
          </div>
        </div>
      ) : (
        /* Fallback Simulation View */
        <div className="relative w-full h-full bg-gradient-to-br from-[#120a22] via-[#090611] to-[#040207] flex flex-col items-center justify-center p-6 text-center">
          {/* Dynamic Waves */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0,transparent_70%)] animate-pulse pointer-events-none" />

          <motion.div
            animate={{ scale: micActive ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 border-2 border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(225,29,72,0.4)] mb-4"
          >
            <User className="w-12 h-12 text-white" />
            {!videoActive && (
              <div className="absolute bottom-0 right-0 bg-rose-600 p-1.5 rounded-full border border-white">
                <VideoOff className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>

          <h4 className="text-base font-bold text-white mb-1">Vous (Mode Démonstration)</h4>
          <p className="text-xs text-white/50 max-w-xs mb-4">
            {!hasPermission
              ? "Caméra non détectée ou permission désactivée. Avatar simulé actif."
              : "Caméra masquée."}
          </p>

          <button
            onClick={onToggleVideo}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full border border-white/15 transition-colors"
          >
            <Camera className="w-4 h-4 text-rose-400" />
            {videoActive ? "Masquer la vidéo" : "Activer la caméra"}
          </button>
        </div>
      )}
    </div>
  );
}
