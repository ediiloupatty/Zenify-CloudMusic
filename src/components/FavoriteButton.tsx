"use client";

import { useState } from "react";
import { toggleFavoriteAction } from "@/app/actions/favorites";

export default function FavoriteButton({ 
  trackId, 
  initialIsFavorited,
  isLoggedIn 
}: { 
  trackId: string, 
  initialIsFavorited: boolean,
  isLoggedIn: boolean
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      alert("Please sign in to favorite tracks.");
      return;
    }

    setIsPending(true);
    // Optimistic UI update
    setIsFavorited(!isFavorited);
    
    const result = await toggleFavoriteAction(trackId, isFavorited);
    if (!result.success) {
      // Revert if failed
      setIsFavorited(isFavorited);
      alert(result.error);
    }
    setIsPending(false);
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={isPending}
      className={`p-2 rounded-full transition-colors ${isFavorited ? 'text-red-500' : 'text-slate-500 hover:text-white'} disabled:opacity-50`}
      title="Favorite"
    >
      {isFavorited ? "❤️" : "🤍"}
    </button>
  );
}
