"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  reducedMotion: boolean;
  toggleTheme: () => void;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("zenify-theme") as Theme | null;
    const savedMotion = localStorage.getItem("zenify-reduced-motion");
    if (savedTheme) setTheme(savedTheme);
    if (savedMotion === "true") setReducedMotion(true);
  }, []);

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zenify-theme", theme);
  }, [theme]);

  // Apply reduced motion to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-reduced-motion", String(reducedMotion));
    localStorage.setItem("zenify-reduced-motion", String(reducedMotion));
  }, [reducedMotion]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleReducedMotion = () => setReducedMotion((m) => !m);

  return (
    <ThemeContext.Provider value={{ theme, reducedMotion, toggleTheme, toggleReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
