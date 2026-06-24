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
      {currentCategory && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Tracks in {currentCategory}</h3>
          {displayTracks.length === 0 ? (
            <p className="text-slate-400">No tracks found. Upload some via the Admin panel.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {displayTracks.map((track, idx) => {
                const isFavorited = userFavorites.includes(track.id);
                return (
                  <div 
                    key={track.id} 
                    className="flex items-center justify-between p-4 glass-panel rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => playTrack(displayTracks, idx)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 w-6 text-right">{idx + 1}</span>
                      <FavoriteButton trackId={track.id} initialIsFavorited={isFavorited} isLoggedIn={isLoggedIn} />
                      <span className="font-medium text-white">{track.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{track.category}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
