"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMotion = localStorage.getItem("zenify-reduced-motion");
    if (savedMotion === "true") setReducedMotion(true);
  }, []);

  // Force dark theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Apply reduced motion to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-reduced-motion", String(reducedMotion));
    localStorage.setItem("zenify-reduced-motion", String(reducedMotion));
  }, [reducedMotion]);

  const toggleReducedMotion = () => setReducedMotion((m) => !m);

  return (
    <ThemeContext.Provider value={{ reducedMotion, toggleReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
