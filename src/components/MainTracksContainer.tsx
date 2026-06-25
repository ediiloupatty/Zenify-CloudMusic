"use client";

import useSWR from "swr";
import FavoriteButton from "./FavoriteButton";
import { Track } from "@/lib/cloudflare";
import { usePlayer } from "@/context/PlayerContext";

// Generate a consistent index from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Beautiful gradient palettes for track covers
const COVER_PALETTES = [
  { from: "#6366f1", to: "#8b5cf6" }, // indigo → violet
  { from: "#14b8a6", to: "#06b6d4" }, // teal → cyan
  { from: "#f43f5e", to: "#ec4899" }, // rose → pink
  { from: "#f59e0b", to: "#f97316" }, // amber → orange
  { from: "#10b981", to: "#059669" }, // emerald
  { from: "#3b82f6", to: "#6366f1" }, // blue → indigo
  { from: "#a855f7", to: "#ec4899" }, // purple → pink
  { from: "#06b6d4", to: "#3b82f6" }, // cyan → blue
  { from: "#84cc16", to: "#10b981" }, // lime → emerald
  { from: "#f97316", to: "#ef4444" }, // orange → red
];

// SVG icon paths for different music icons
const MUSIC_ICONS = [
  // music note
  "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  // headphone
  "M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z",
  // equalizer
  "M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z",
  // vinyl record
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z",
  // speaker
  "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
];

function TrackCoverArt({ title, category }: { title: string; category: string }) {
  const palIdx = hashString(title + category) % COVER_PALETTES.length;
  const iconIdx = hashString(title) % MUSIC_ICONS.length;
  const palette = COVER_PALETTES[palIdx];
  const iconPath = MUSIC_ICONS[iconIdx];

  return (
    <div
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
      }}
    >
      {/* soft glow circle */}
      <div
        className="absolute w-10 h-10 rounded-full opacity-30"
        style={{ background: "white", filter: "blur(10px)" }}
      />
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="white"
        className="relative z-10 drop-shadow opacity-90"
      >
        <path d={iconPath} />
      </svg>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MainTracksContainer({
  initialTracks,
  currentCategory,
  userFavorites,
  isLoggedIn,
}: {
  initialTracks: Track[];
  currentCategory: string | null;
  userFavorites: string[];
  isLoggedIn: boolean;
}) {
  const url = currentCategory ? `/api/tracks?category=${encodeURIComponent(currentCategory)}` : null;
  const { playTrack } = usePlayer();
  
  // Use SWR for polling (refresh every 3 seconds). Fallback to initialTracks.
  const { data } = useSWR(url, fetcher, { 
    refreshInterval: 3000,
    fallbackData: { tracks: initialTracks }
  });

  const displayTracks: Track[] = data?.tracks || initialTracks;

  return (
    <>
      {/* Tracklist Preview */}
      <div className="flex flex-col gap-4">
        {displayTracks.length === 0 ? (
          <p className="text-slate-400">No tracks found. Upload some via the Admin panel.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {displayTracks.map((track, idx) => {
              const isFavorited = userFavorites.includes(track.id);
              return (
                <div 
                  key={track.id} 
                  className="track-row flex items-center justify-between p-3 rounded-xl cursor-pointer group"
                  onClick={() => playTrack(displayTracks, idx)}
                >
                  {/* Left Side: Cover Art + Title + Category */}
                  <div className="flex items-center gap-4 w-1/2">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md transition-shadow group-hover:shadow-lg">
                      <TrackCoverArt title={track.title} category={track.category} />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-sm truncate transition-colors group-hover:text-[var(--accent)]"
                        style={{ color: "var(--text-primary)" }}>
                        {track.title}
                        {track.file_url && (track.file_url.endsWith('.flac') || track.file_url.endsWith('.wav')) && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 text-white tracking-wider border border-white/20 align-middle">HI-RES</span>
                        )}
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{track.artist || track.category}</span>
                    </div>
                  </div>

                  {/* Middle: Duration */}
                  <div className="w-16 text-center">
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>3:40</span>
                  </div>

                  {/* Right Side: Rating + Favorite + Menu */}
                  <div className="flex items-center gap-4 justify-end w-1/4">
                    <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-yellow-500 opacity-40 group-hover:opacity-100 transition-opacity">
                      3 <span className="text-[10px]">★</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FavoriteButton trackId={track.id} initialIsFavorited={isFavorited} isLoggedIn={isLoggedIn} />
                    </div>
                    <button className="font-bold tracking-widest pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: "var(--text-muted)" }}>••</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
