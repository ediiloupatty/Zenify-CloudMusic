"use client";

import { useEffect } from "react";

// Register the service worker for offline audio caching.
// This component renders nothing — it only runs the registration side effect.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.log("[SW] registered, scope:", reg.scope);

        // Auto-update: when a new SW is found, activate it immediately.
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated") {
              console.log("[SW] updated and activated");
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[SW] registration failed:", err);
      });
  }, []);

  return null;
}
