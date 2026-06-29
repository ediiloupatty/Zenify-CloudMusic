import Link from "next/link";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen font-sans bg-[#1d2230] text-slate-100 overflow-x-hidden selection:bg-[#14b8a6] selection:text-white flex flex-col">
      {/* ─── NAVBAR ────────────────────────────────────────────── */}
      <header className="w-full px-8 md:px-16 py-8 max-w-[1400px] mx-auto flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#14b8a6] transition-transform group-hover:scale-110">
            <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M6 7L6 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 7L18 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M3 10L3 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M21 10L21 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-xl tracking-wide text-white">
            Zenify
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
          <a href="#about" className="hover:text-white transition-colors">about</a>
          <a href="#features" className="hover:text-white transition-colors">features</a>
          <a href="#screenshots" className="hover:text-white transition-colors">screenshots</a>
          <a href="#download" className="text-white border-b-2 border-[#14b8a6] pb-1 font-semibold">download</a>
          <a href="https://github.com/ediiloupatty/Zenify" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">github</a>
          <Link href="/player" className="hover:text-white transition-colors font-semibold text-[#14b8a6]">open player</Link>
        </nav>

        <div className="flex md:hidden items-center">
          <Link href="/player" className="text-sm font-bold text-[#14b8a6] hover:underline">
            Open Player
          </Link>
        </div>
      </header>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section id="about" className="flex-1 px-8 md:px-16 pt-8 pb-20 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
        
        {/* Left Column (Hero Text & Download) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          <p className="text-sm font-semibold text-slate-400 mb-6 tracking-wide uppercase">
            A minimal music player for Windows
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light tracking-tight leading-none text-white mb-2">
            MUSIC,
          </h1>
          <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light tracking-tight leading-none text-[#14b8a6] mb-8">
            REIMAGINED.
          </h1>

          {/* Clean horizontal line */}
          <div className="w-14 h-[2px] bg-slate-500/60 mb-8" />

          <p className="text-lg text-slate-300 leading-relaxed mb-10 font-normal max-w-md">
            Zenify is a lightweight desktop music player that helps you organize, play, and enjoy your music — beautifully.
          </p>

          <div id="download">
            <a
              href="https://github.com/ediiloupatty/Zenify/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-8 py-4 bg-transparent border-2 border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6] hover:text-[#1d2230] transition-all font-bold tracking-wider text-sm shadow-[0_0_25px_rgba(20,184,166,0.25)] group"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="transition-colors">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
              <span>DOWNLOAD FOR WINDOWS</span>
            </a>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>Windows 10 or later</span>
            <span>•</span>
            <span>Free to use</span>
            <span>•</span>
            <Link href="/player" className="hover:text-white transition-colors underline font-semibold text-slate-300">
              Open Web Player
            </Link>
          </div>
        </div>

        {/* Right Column (Stunning App Mockup) */}
        <div id="screenshots" className="lg:col-span-7 w-full flex justify-center lg:justify-end lg:pl-12 xl:pl-16">
          <div className="relative w-full max-w-4xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden border border-slate-700/50 bg-[#12141d] flex flex-col select-none">
            
            {/* Window Chrome Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161823] border-b border-slate-800 text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700/50" />
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono text-sm">
                <span>−</span>
                <span>□</span>
                <span className="hover:text-red-500 cursor-pointer">×</span>
              </div>
            </div>

            {/* App Main Body */}
            <div className="flex flex-1 h-[440px] sm:h-[480px]">
              
              {/* Mockup Sidebar */}
              <div className="hidden sm:flex flex-col w-[200px] bg-[#12141d] p-5 border-r border-slate-800/80 text-sm">
                <div className="flex items-center gap-3 mb-8 text-white font-bold tracking-wide">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#14b8a6]">
                    <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M6 7L6 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M18 7L18 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span>Zenify</span>
                </div>

                <div className="flex flex-col gap-1 text-slate-400 font-medium mb-8">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#14b8a6]/10 text-[#14b8a6] border-l-4 border-[#14b8a6] font-bold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    <span>Home</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <span>Search</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <span>Your Library</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    <span>Playlists</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/></svg>
                    <span>Albums</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <span>Artists</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>Liked Songs</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-500 tracking-wider uppercase px-3 mb-3">
                  <span>PLAYLISTS</span>
                  <span>+</span>
                </div>
                <div className="flex flex-col gap-3 px-3 text-xs">
                  <div className="flex items-center gap-3 cursor-pointer hover:text-white">
                    <span className="w-6 h-6 rounded bg-[#14b8a6] flex-shrink-0" />
                    <div className="flex flex-col"><span className="font-bold text-slate-300">Chill Vibes</span><span className="text-[10px] text-slate-500">24 tracks</span></div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer hover:text-white">
                    <span className="w-6 h-6 rounded bg-[#8b5cf6] flex-shrink-0" />
                    <div className="flex flex-col"><span className="font-bold text-slate-300">Night Drive</span><span className="text-[10px] text-slate-500">18 tracks</span></div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer hover:text-white">
                    <span className="w-6 h-6 rounded bg-[#f97316] flex-shrink-0" />
                    <div className="flex flex-col"><span className="font-bold text-slate-300">Focus</span><span className="text-[10px] text-slate-500">32 tracks</span></div>
                  </div>
                </div>
              </div>

              {/* Mockup Main Area */}
              <div className="flex-1 bg-[#161823] p-6 sm:p-8 overflow-hidden flex flex-col gap-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Good morning</h2>

                {/* Recently Played */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300 tracking-wide">Recently Played</span>
                    <span className="text-[#14b8a6] hover:underline cursor-pointer">View all</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5 group cursor-pointer">
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden shadow-lg border border-slate-700/50 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                        <span className="text-slate-500 text-xs font-bold">lowkey</span>
                      </div>
                      <span className="font-bold text-xs text-white truncate mt-1">lowkey</span>
                      <span className="text-[11px] text-slate-400 truncate">Niki</span>
                    </div>
                    <div className="flex flex-col gap-1.5 group cursor-pointer">
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden shadow-lg border border-slate-700/50 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                        <span className="text-indigo-400 text-xs font-bold">Lose</span>
                      </div>
                      <span className="font-bold text-xs text-white truncate mt-1">Lose</span>
                      <span className="text-[11px] text-slate-400 truncate">Niki</span>
                    </div>
                    <div className="flex flex-col gap-1.5 group cursor-pointer">
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-900 to-teal-950 overflow-hidden shadow-lg border border-slate-700/50 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                        <span className="text-emerald-400 text-xs font-bold">Pools</span>
                      </div>
                      <span className="font-bold text-xs text-white truncate mt-1">Pools</span>
                      <span className="text-[11px] text-slate-400 truncate">Niki</span>
                    </div>
                    <div className="flex flex-col gap-1.5 group cursor-pointer">
                      <div className="aspect-square rounded-xl bg-[#f97316] overflow-hidden shadow-lg border border-orange-500/50 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                          <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                        </div>
                      </div>
                      <span className="font-bold text-xs text-white truncate mt-1">Every Summertime</span>
                      <span className="text-[11px] text-slate-400 truncate">Niki</span>
                    </div>
                  </div>
                </div>

                {/* Your Playlists */}
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300 tracking-wide">Your Playlists</span>
                    <span className="text-[#14b8a6] hover:underline cursor-pointer">View all</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1 cursor-pointer group">
                      <div className="h-28 rounded-xl bg-[#14b8a6] p-4 flex flex-col justify-between shadow-lg group-hover:scale-105 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        <span className="font-bold text-xs text-white truncate">Niki</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium mt-1">17 tracks</span>
                    </div>
                    <div className="flex flex-col gap-1 cursor-pointer group">
                      <div className="h-28 rounded-xl bg-[#6366f1] p-4 flex flex-col justify-between shadow-lg group-hover:scale-105 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        <span className="font-bold text-xs text-white truncate">DJ Snake</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium mt-1">11 tracks</span>
                    </div>
                    <div className="flex flex-col gap-1 cursor-pointer group">
                      <div className="h-28 rounded-xl bg-[#f97316] p-4 flex flex-col justify-between shadow-lg group-hover:scale-105 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        <span className="font-bold text-xs text-white truncate">bbno$</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium mt-1">8 tracks</span>
                    </div>
                    <div className="flex flex-col gap-1 cursor-pointer group">
                      <div className="h-28 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 group-hover:border-slate-500 transition-colors">
                        <span className="text-2xl text-slate-500 group-hover:text-slate-300 transition-colors">+</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium mt-1 text-center">Create New Playlist</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Mockup Bottom Player */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#11131b] border-t border-slate-800 text-white select-none">
              <div className="flex items-center gap-3 w-40 truncate">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex-shrink-0 border border-slate-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">LK</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-white truncate">lowkey</span>
                  <span className="text-[10px] text-slate-400 truncate">Niki</span>
                </div>
              </div>

              {/* Controls + Scrub bar */}
              <div className="flex items-center gap-6 flex-1 max-w-md justify-center">
                <span className="text-[11px] text-slate-500 font-mono">1:07</span>
                <div className="flex-1 h-1 rounded-full bg-slate-700 relative flex items-center">
                  <div className="w-1/3 h-full bg-[#14b8a6] rounded-full" />
                  <div className="w-3 h-3 rounded-full bg-white absolute left-1/3 -ml-1.5 shadow" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono">2:51</span>

                <div className="flex items-center gap-4 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  <div className="w-8 h-8 rounded-full bg-[#14b8a6] flex items-center justify-center text-[#11131b] shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                </div>
              </div>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-3 w-40 justify-end text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <div className="w-20 h-1 rounded-full bg-slate-700 relative flex items-center">
                  <div className="w-4/5 h-full bg-[#14b8a6] rounded-full" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white absolute left-4/5 -ml-1 shadow" />
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-2"><path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z"/></svg>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─── DIVIDER ───────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 w-full">
        <div className="w-full border-t border-slate-700/50 my-12" />
      </div>

      {/* ─── FEATURES GRID ─────────────────────────────────────── */}
      <section id="features" className="max-w-[1400px] mx-auto px-8 md:px-16 pb-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#14b8a6] mb-2 font-mono">01</span>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Minimal Design</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-normal">
            Clean and modern interface that stays out of your way.
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#14b8a6] mb-2 font-mono">02</span>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Your Music</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-normal">
            Play your local files with full support for all formats.
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#14b8a6] mb-2 font-mono">03</span>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Smart Library</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-normal">
            Organize automatically. Find anything, instantly.
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#14b8a6] mb-2 font-mono">04</span>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Built for Windows</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-normal">
            Lightweight, fast, and optimized for performance.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-800/80 bg-[#171a26] py-10 px-8 md:px-16 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#14b8a6]">
              <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M6 7L6 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M18 7L18 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-slate-400 font-bold tracking-wide">Zenify</span>
          </div>
          <span>© {new Date().getFullYear()} Zenify. Minimal music player for Windows.</span>
          <div className="flex items-center gap-6 font-semibold">
            <a href="https://github.com/ediiloupatty/Zenify" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <Link href="/player" className="hover:text-white transition-colors">Web Player</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
