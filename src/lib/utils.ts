// ─── Shared UI utilities ─────────────────────────────────────────────────────
// Extracted from multiple components to eliminate duplication.

// Deterministic hash from a string — used for consistent color/icon assignment.
// Two variants existed in the codebase; this one (djb2-style) covers both.
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Format seconds into "m:ss" (e.g. 217 → "3:37"). Returns "" for invalid input.
export function formatDuration(secs?: number): string {
  if (!secs || !Number.isFinite(secs) || secs <= 0) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// ─── Gradient palettes ───────────────────────────────────────────────────────
// Simple 2-stop palettes used by most cover fallbacks, album cards, etc.
export const PALETTES: [string, string][] = [
  ["#6366f1", "#8b5cf6"],  // indigo → violet
  ["#14b8a6", "#06b6d4"],  // teal → cyan
  ["#f43f5e", "#ec4899"],  // rose → pink
  ["#f59e0b", "#f97316"],  // amber → orange
  ["#10b981", "#059669"],  // emerald
  ["#3b82f6", "#6366f1"],  // blue → indigo
  ["#a855f7", "#ec4899"],  // purple → pink
  ["#06b6d4", "#3b82f6"],  // cyan → blue
  ["#84cc16", "#10b981"],  // lime → emerald
  ["#f97316", "#ef4444"],  // orange → red
];

// 3-stop palettes with a mid color — used by the full cover art generators
// (BottomPlayer, MainTracksContainer).
export const COVER_PALETTES = [
  { from: "#6366f1", to: "#8b5cf6", mid: "#7c3aed" },
  { from: "#14b8a6", to: "#06b6d4", mid: "#0891b2" },
  { from: "#f43f5e", to: "#ec4899", mid: "#db2777" },
  { from: "#f59e0b", to: "#f97316", mid: "#ea580c" },
  { from: "#10b981", to: "#059669", mid: "#047857" },
  { from: "#3b82f6", to: "#6366f1", mid: "#4f46e5" },
  { from: "#a855f7", to: "#ec4899", mid: "#c026d3" },
  { from: "#06b6d4", to: "#3b82f6", mid: "#2563eb" },
  { from: "#84cc16", to: "#10b981", mid: "#16a34a" },
  { from: "#f97316", to: "#ef4444", mid: "#dc2626" },
];

// SVG icon paths for generated cover art when no album art is available.
export const MUSIC_ICON_PATHS = [
  "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  "M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z",
  "M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z",
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z",
  "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
];
