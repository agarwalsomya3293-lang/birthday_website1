import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { BIRTHDAY_CONFIG } from "../data/memories";

export const AudioEngine: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio(BIRTHDAY_CONFIG.musicUrl);
    audio.loop = true;
    audio.volume = 0; // Start at 0 for fade-in
    audioRef.current = audio;

    // Listen to custom event to start audio from Intro Loader
    const handleStartMusic = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn();
        })
        .catch((err) => {
          console.log("Audio play blocked, waiting for user click.", err);
        });
    };

    window.addEventListener("play-love-music", handleStartMusic);

    return () => {
      window.removeEventListener("play-love-music", handleStartMusic);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const fadeIn = () => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    audioRef.current.volume = 0;
    const targetVolume = 0.4; // Soft comfortable background volume
    const step = 0.02;

    fadeIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.volume < targetVolume) {
          audioRef.current.volume = Math.min(audioRef.current.volume + step, targetVolume);
        } else {
          clearInterval(fadeIntervalRef.current!);
        }
      }
    }, 50);
  };

  const fadeOut = (callback?: () => void) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const step = 0.03;

    fadeIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.volume > 0.02) {
          audioRef.current.volume = Math.max(audioRef.current.volume - step, 0);
        } else {
          audioRef.current.volume = 0;
          audioRef.current.pause();
          clearInterval(fadeIntervalRef.current!);
          if (callback) callback();
        }
      }
    }, 50);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      fadeOut(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        fadeIn();
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering togglePlay
    if (!audioRef.current) return;

    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex items-center gap-3">
      {/* Visualizer and main toggle */}
      <button
        onClick={togglePlay}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full glass-panel border border-pink-300/30 hover:border-pink-300/60 shadow-lg text-cream-100 backdrop-blur-md cursor-none overflow-hidden transition-all duration-300 hover:scale-105"
      >
        {/* Glow backdrop effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Spinning Vinyl Visual */}
        <div className={`absolute w-12 h-12 rounded-full border border-pink-300/10 flex items-center justify-center bg-black/40 ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}>
          {/* Audio Wave Sound Bars */}
          <div className="flex gap-0.5 items-end justify-center h-4">
            <span className={`w-0.5 bg-pink-300 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.8s_infinite_0.1s]" : "h-1"}`} style={{ height: isPlaying ? undefined : "4px" }} />
            <span className={`w-0.5 bg-pink-400 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.6s_infinite_0.3s]" : "h-2"}`} style={{ height: isPlaying ? undefined : "6px" }} />
            <span className={`w-0.5 bg-gold-400 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.9s_infinite_0.2s]" : "h-1.5"}`} style={{ height: isPlaying ? undefined : "5px" }} />
            <span className={`w-0.5 bg-pink-300 rounded-full transition-all duration-300 ${isPlaying ? "animate-[bounce_0.7s_infinite_0.4s]" : "h-1"}`} style={{ height: isPlaying ? undefined : "3px" }} />
          </div>
        </div>
      </button>

      {/* Quick Mute Control */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full glass-panel border border-pink-300/10 text-pink-300/80 hover:text-pink-300 hover:scale-105 transition-all cursor-none"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};
