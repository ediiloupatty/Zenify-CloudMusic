"use client";

import { useEffect, useRef, useState } from "react";

// Incremental rendering for long lists: render ~`initial` items first, then
// reveal `step` more whenever the user scrolls a sentinel element near the
// viewport. Keeps the DOM small without pulling in a virtualization library.
//
// Usage:
//   const { visibleCount, sentinelRef, hasMore } = useIncrementalList(items.length);
//   {items.slice(0, visibleCount).map(...)}
//   {hasMore && <div ref={sentinelRef} />}
//
// Note: still pass the FULL array to the player/queue — only the *rendered*
// rows are sliced, not the underlying data.
export function useIncrementalList(total: number, initial = 40, step = 40) {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(initial, total));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // When the underlying list changes size (e.g. switching category/playlist),
  // start over from the top. If `total` is unchanged this does not run, so a
  // scrolled-down position is preserved across revalidations.
  useEffect(() => {
    setVisibleCount(Math.min(initial, total));
  }, [total, initial]);

  useEffect(() => {
    if (visibleCount >= total) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + step, total));
        }
      },
      // Load a bit before the sentinel is actually on screen for a seamless feel.
      { rootMargin: "600px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visibleCount, total, step]);

  return { visibleCount, sentinelRef, hasMore: visibleCount < total };
}
