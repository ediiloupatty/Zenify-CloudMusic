"use client";

import useSWR from "swr";
import FavoriteButton from "./FavoriteButton";
import { Track } from "@/lib/cloudflare";
import { usePlayer } from "@/context/PlayerContext";

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

  // If no category selected, just render nothing for the tracklist part, 
  // but if tracks somehow exist (they won't if currentCategory is null based on logic), handle it.
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
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => playTrack(displayTracks, idx)}
                >
                  {/* Left Side: Icon + Title + Category */}
                  <div className="flex items-center gap-4 w-1/2">
                    <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/80 to-purple-600/80 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                      <span className="text-xl group-hover:opacity-0 transition-opacity duration-300">🎵</span>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-lg ml-0.5">▶</span>
                      </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-white text-sm truncate group-hover:text-teal-400 transition-colors">{track.title}</span>
                      <span className="text-xs text-slate-400 truncate">{track.category}</span>
                    </div>
                  </div>

                  {/* Middle: Duration */}
                  <div className="w-16 text-center">
                    <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">3:40</span>
                  </div>

                  {/* Right Side: Rating + Favorite + Menu */}
                  <div className="flex items-center gap-4 justify-end w-1/4">
                    <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity">
                      3 <span className="text-[10px]">★</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FavoriteButton trackId={track.id} initialIsFavorited={isFavorited} isLoggedIn={isLoggedIn} />
                    </div>
                    <button className="text-slate-600 hover:text-white font-bold tracking-widest pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">••</button>
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
