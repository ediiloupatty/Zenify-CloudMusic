"use client";

import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, reducedMotion, toggleTheme, toggleReducedMotion } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-4 px-5 pt-6 pb-4 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <Link
          href="/"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 py-6 pb-48 max-w-lg mx-auto w-full flex flex-col gap-6">

        {/* Appearance Section */}
        <section>
          <h2
            className="text-xs font-black tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Appearance
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-card)" }}
          >
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
                >
                  {theme === "dark" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Theme
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={toggleTheme}
                className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  background: theme === "light" ? "var(--accent)" : "var(--bg-card-hover)",
                  border: "1px solid var(--border-card)",
                }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: theme === "light" ? "calc(100% - 1.375rem)" : "0.125rem" }}
                />
              </button>
            </div>

            <div style={{ height: "1px", background: "var(--border-subtle)", margin: "0 1rem" }} />

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Reduce Motion
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {reducedMotion ? "Animations disabled" : "Animations enabled"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleReducedMotion}
                className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  background: reducedMotion ? "var(--accent)" : "var(--bg-card-hover)",
                  border: "1px solid var(--border-card)",
                }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: reducedMotion ? "calc(100% - 1.375rem)" : "0.125rem" }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2
            className="text-xs font-black tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            About
          </h2>
          <div
            className="rounded-2xl px-4 py-5 flex items-center gap-4"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-card)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--accent), #6366f1)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Zenify Cloud Music</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Version 1.0.0 · Hi-Res Audio Player</p>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section>
          <h2
            className="text-xs font-black tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Account
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-card)" }}
          >
            <Link
              href="/login"
              className="flex items-center justify-between px-4 py-4 transition-all active:scale-[0.99]"
              style={{ color: "var(--text-primary)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <p className="font-semibold text-sm">Sign In</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-muted)" }}>
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </Link>

            <div style={{ height: "1px", background: "var(--border-subtle)", margin: "0 1rem" }} />

            <Link
              href="/admin"
              className="flex items-center justify-between px-4 py-4 transition-all active:scale-[0.99]"
              style={{ color: "var(--text-primary)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                </div>
                <p className="font-semibold text-sm">Admin Panel</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-muted)" }}>
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
