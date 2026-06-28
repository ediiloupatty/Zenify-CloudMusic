"use client";

import { useState, useEffect, useCallback } from "react";

export type CacheStats = {
  totalSize: number;
  trackCount: number;
  tracks: { url: string; size: number }[];
};

/** Communicates with the service worker for cache stats & management. */
export function useAudioCache() {
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [swReady, setSwReady] = useState(false);

  // Track online/offline status
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Wait for the SW to be ready
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready.then(() => setSwReady(true));

    // Listen for messages from the SW
    const onMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === "CACHE_STATS") {
        setStats(payload);
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);

  const postMessage = useCallback(
    (msg: { type: string; payload?: unknown }) => {
      if (!swReady) return;
      navigator.serviceWorker.controller?.postMessage(msg);
    },
    [swReady]
  );

  const refreshStats = useCallback(() => {
    postMessage({ type: "GET_CACHE_STATS" });
  }, [postMessage]);

  const clearCache = useCallback(() => {
    postMessage({ type: "CLEAR_AUDIO_CACHE" });
    setStats(null);
  }, [postMessage]);

  const deleteTrack = useCallback(
    (url: string) => {
      postMessage({ type: "DELETE_CACHED_TRACK", payload: { url } });
    },
    [postMessage]
  );

  // Auto-refresh stats when SW is ready
  useEffect(() => {
    if (swReady) refreshStats();
  }, [swReady, refreshStats]);

  return { isOnline, stats, swReady, refreshStats, clearCache, deleteTrack };
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
