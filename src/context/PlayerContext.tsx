"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Track } from "@/lib/cloudflare";

interface PlayerContextType {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  playTrack: (tracks: Track[], startIndex: number) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (newTracks: Track[], startIndex: number) => {
    setTracks(newTracks);
    setCurrentTrackIndex(startIndex);
    setIsPlaying(true);
  };

  const playNextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const playPrevTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        currentTrackIndex,
        isPlaying,
        playTrack,
        playNextTrack,
        playPrevTrack,
        setIsPlaying,
        setCurrentTrackIndex,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
