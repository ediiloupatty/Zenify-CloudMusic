"use client";

import { useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import type { Track } from "@/lib/cloudflare";

// Receives a track pre-fetched server-side from the ?play= URL param and
// immediately starts playback. Runs once on mount, then the player takes over.
export default function AutoPlayTrack({ track }: { track: Track }) {
  const { playTrack } = usePlayer();

  useEffect(() => {
    playTrack([track], 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  return null;
}
