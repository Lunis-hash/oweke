import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Service centralisé pour les retours sonores et vibrations (Soft Audio & Haptic Feedback).
 * Conçu pour offrir des sons très doux et apaisants lors des interactions clés.
 */
class SoundService {
  private isSoundEnabled: boolean = true;
  private isHapticsEnabled: boolean = true;

  constructor() {
    this.configureAudioSession();
  }

  private async configureAudioSession() {
    try {
      const { Audio } = require('expo-av');
      if (Audio) {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      }
    } catch (e) {
      // Ignore si expo-av n'est pas encore initialisé
    }
  }

  /**
   * Active ou désactive le son
   */
  setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  /**
   * Active ou désactive les vibrations haptiques
   */
  setHapticsEnabled(enabled: boolean) {
    this.isHapticsEnabled = enabled;
  }

  /**
   * Génère un son doux synthétique (Web/Mobile) via Web Audio API si disponible,
   * garantissant un fonctionnement 100% autonome sans fichiers mp3 lourds.
   */
  private playSoftTone(frequencies: number[], durationMs: number = 300, type: OscillatorType = 'sine') {
    if (!this.isSoundEnabled) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        
        frequencies.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
          
          // Enveloppe d'attaque et d'extinction douce (Soft Attack & Release)
          gain.gain.setValueAtTime(0.01, ctx.currentTime + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + index * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + (durationMs / 1000));
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime + index * 0.08);
          osc.stop(ctx.currentTime + index * 0.08 + (durationMs / 1000) + 0.1);
        });
      } catch (e) {
        // Fallback silencieux
      }
    }
  }

  /**
   * 1. Déclenché lors de l'envoi d'un Like / Connexion
   * Son : Marimba doux montant (Mi -> La) + Vibration moyenne
   */
  async playLikeSent() {
    if (this.isHapticsEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {}
    }
    // Féquences E5 (659Hz) -> A5 (880Hz)
    this.playSoftTone([659.25, 880], 250, 'sine');
  }

  /**
   * 2. Déclenché lorsqu'un nouveau Like est reçu
   * Son : Double carillon apaisant (Do -> Sol) + Double pulsation
   */
  async playLikeReceived() {
    if (this.isHapticsEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
    }
    // Fréquences C6 (1046Hz) -> G5 (783Hz)
    this.playSoftTone([1046.50, 783.99], 350, 'sine');
  }

  /**
   * 3. Déclenché lors d'un Match / Célébration Harmonie
   * Son : Arpeggio de Harpe élégant (Do -> Mi -> Sol -> Do octave) + Vibration d'impact fort
   */
  async playMatchCelebration() {
    if (this.isHapticsEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (e) {}
    }
    // Arpeggio C5 (523Hz) -> E5 (659Hz) -> G5 (783Hz) -> C6 (1046Hz)
    this.playSoftTone([523.25, 659.25, 783.99, 1046.50], 500, 'sine');
  }

  /**
   * 4. Déclenché lors du clic sur un bouton ou choix d'option QCM
   * Son : Pop discret + Haptic Light
   */
  async playOptionSelect() {
    if (this.isHapticsEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
    }
    this.playSoftTone([440], 100, 'triangle');
  }

  /**
   * 5. Déclenché à la réception d'un message instantané
   * Son : Carillon très léger
   */
  async playMessageReceived() {
    if (this.isHapticsEnabled) {
      try {
        await Haptics.selectionAsync();
      } catch (e) {}
    }
    this.playSoftTone([587.33, 880], 200, 'sine');
  }
}

export const soundService = new SoundService();
export default soundService;
