"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type AudioContextConstructor = typeof AudioContext;

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: AudioContextConstructor;
};

const CLICK_NOTES = [523.25, 659.25, 783.99, 987.77];
const MUSIC_NOTES = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 392];
const BASS_NOTES = [130.81, 130.81, 164.81, 196, 146.83, 146.83, 174.61, 220];

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;

  return AudioContextClass ? new AudioContextClass() : null;
}

function playTone(
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType,
  destination: AudioNode,
  startTime = audioContext.currentTime,
) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    frequency * 1.08,
    startTime + duration,
  );
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

export function SoundEffects() {
  const pathname = usePathname();
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicBeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const musicStepRef = useRef(0);

  useEffect(() => {
    const getOrCreateAudioContext = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = getAudioContext();
      }

      const audioContext = audioContextRef.current;
      if (audioContext?.state === "suspended") {
        await audioContext.resume();
      }

      return audioContext;
    };

    const playClick = async () => {
      const audioContext = await getOrCreateAudioContext();
      if (!audioContext) return;

      const note = CLICK_NOTES[Math.floor(Math.random() * CLICK_NOTES.length)];
      const now = audioContext.currentTime;
      playTone(audioContext, note, 0.11, 0.28, "square", audioContext.destination, now);
      playTone(audioContext, note * 1.5, 0.09, 0.18, "triangle", audioContext.destination, now + 0.035);
    };

    const playSuccess = async () => {
      const audioContext = await getOrCreateAudioContext();
      if (!audioContext) return;

      const now = audioContext.currentTime;
      playTone(audioContext, 523.25, 0.1, 0.3, "square", audioContext.destination, now);
      playTone(audioContext, 659.25, 0.1, 0.3, "square", audioContext.destination, now + 0.1);
      playTone(audioContext, 783.99, 0.2, 0.3, "square", audioContext.destination, now + 0.2);
      playTone(audioContext, 1046.50, 0.4, 0.3, "sine", audioContext.destination, now + 0.3);
    };

    const stopMusic = () => {
      if (musicBeatRef.current) {
        clearInterval(musicBeatRef.current);
        musicBeatRef.current = null;
      }
    };

    const startMusic = async () => {
      if (pathname !== '/play' && pathname !== '/join') {
        stopMusic();
        return;
      }
      if (musicBeatRef.current) return;

      const audioContext = await getOrCreateAudioContext();
      if (!audioContext) return;

      const master = audioContext.createGain();
      const compressor = audioContext.createDynamicsCompressor();
      master.gain.value = 0.34;
      compressor.threshold.value = -18;
      compressor.knee.value = 8;
      compressor.ratio.value = 5;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.18;
      master.connect(compressor);
      compressor.connect(audioContext.destination);

      const playNextBeat = () => {
        const step = musicStepRef.current % MUSIC_NOTES.length;
        musicStepRef.current += 1;
        playTone(audioContext, MUSIC_NOTES[step], 0.28, 0.22, "square", master);
        playTone(audioContext, BASS_NOTES[step], 0.34, 0.26, "triangle", master);
        if (step % 2 === 0) {
          playTone(audioContext, MUSIC_NOTES[step] * 2, 0.08, 0.13, "sine", master, audioContext.currentTime + 0.14);
        }
      };

      playNextBeat();
      musicBeatRef.current = setInterval(playNextBeat, 320);
    };

    if (pathname === '/play' || pathname === '/join') {
      void startMusic();
    } else {
      stopMusic();
    }

    const handleInteraction = (event: Event) => {
      if (pathname === '/play' || pathname === '/join') {
        void startMusic();
      }
      
      let shouldPlaySound = false;

      if (event.type === "click") {
        const target = event.target as Element | null;
        const control = target?.closest('button, a, [role="button"]');
        if (control && !(control instanceof HTMLButtonElement && control.disabled)) {
          shouldPlaySound = true;
        }
      } else if (event.type === "keydown") {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === "Enter") {
          shouldPlaySound = true;
        }
      }

      if (shouldPlaySound) {
        void playClick();
      }
    };

    const handleCustomSound = (event: Event) => {
      if (event.type === 'play-sound-success') {
        void playSuccess();
      }
    };

    document.addEventListener("click", handleInteraction, true);
    document.addEventListener("keydown", handleInteraction, true);
    document.addEventListener("pointerdown", handleInteraction, true);
    window.addEventListener("play-sound-success", handleCustomSound);

    return () => {
      document.removeEventListener("click", handleInteraction, true);
      document.removeEventListener("keydown", handleInteraction, true);
      document.removeEventListener("pointerdown", handleInteraction, true);
      window.removeEventListener("play-sound-success", handleCustomSound);
      stopMusic();
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [pathname]);

  return null;
}
