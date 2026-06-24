import Link from "next/link";
import Image from "next/image";
import MainTracksContainer from "@/components/MainTracksContainer";
import { getTracksByCategory, getUserFavorites, Track } from "@/lib/cloudflare";
import { auth, signOut } from "@/auth";

export const dynamic = "force-dynamic";

// Define categories statically for the UI
const CATEGORIES = [
  { id: "Deep Coding", label: "Deep Coding", icon: "👨‍💻", desc: "Electronic, ambient, and lo-fi.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
  { id: "Creative Design", label: "Creative Design", icon: "🎨", desc: "Upbeat and inspiring tunes.", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop" },
  { id: "Routine Tasks", label: "Routine Tasks", icon: "✅", desc: "Energetic and focus-driven.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop" },
  { id: "Relax & Unwind", label: "Relax & Unwind", icon: "☕", desc: "Calm and peaceful melodies.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" },
];

const getBackgroundImage = (category: string | null) => {
  switch (category) {
    case "Deep Coding":
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop";
    case "Creative Design":
      return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000";
    case "Routine Tasks":
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000";
    case "Relax & Unwind":
      return "https://images.unsplash.com/photo-1470246973918-29a5286a5d14?q=80&w=2000";
    default:
      return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop";
  }
};

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const resolvedParams = await searchParams;
  const currentCategory = (resolvedParams?.category as string) || null;

  // Fetch tracks
  const tracks: Track[] = await getTracksByCategory(currentCategory);

  // Fetch Auth Session & Favorites
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userFavorites = isLoggedIn && session.user?.email 
    ? await getUserFavorites(session.user.email) 
    : [];

  const bgImage = getBackgroundImage(currentCategory);

  return (
    <div className="flex flex-col min-h-screen text-slate-100 font-sans relative overflow-hidden pb-24">
      
      {/* Background Layers */}
      <div 
        className="absolute inset-0 z-0 ken-burns-bg opacity-40 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-slate-950/80"></div>
      
      {/* HEADER */}
      <header className="glass-panel sticky top-0 z-40 flex items-center justify-between px-8 py-4 m-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
              <Image src="/logo.png" alt="Focus Stream Logo" width={32} height={32} className="object-cover" />
            </div>
            <h1 className="text-xl font-bold tracking-wide text-white">Focus Stream</h1>
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-white transition-colors text-slate-300">Playlists</Link>
          <a href="#" className="text-sm font-medium hover:text-white transition-colors text-slate-300">Favorites</a>
          <Link href="/admin" className="text-sm font-medium hover:text-teal-400 transition-colors text-slate-300">Admin</Link>
          
          <div className="flex items-center gap-4 border-l border-slate-700 pl-6 ml-2">
            {isLoggedIn ? (
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button type="submit" className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors">Sign Out</button>
              </form>
            ) : (
              <Link href="/login" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
                Sign In
              </Link>
            )}
            {isLoggedIn && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center border border-slate-600 cursor-pointer" title={session.user?.email || ""}>
                <span className="text-xs font-bold">{session.user?.name?.charAt(0) || "U"}</span>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col px-8 pb-32 z-10">
        <div className="mt-8 mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-300">
            {currentCategory ? currentCategory : "Good Afternoon"}
          </h2>
          <p className="text-slate-400 mt-2">
            {currentCategory 
              ? `Playing tracks from ${currentCategory}` 
              : "Pick a vibe and get in the zone."}
          </p>
        </div>

        {/* Categories / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <Link key={cat.id} href={`/?category=${encodeURIComponent(cat.id)}`}>
                <div className={`glass-panel glass-panel-hover group rounded-xl p-6 cursor-pointer flex flex-col justify-end gap-2 overflow-hidden relative min-h-[200px] ${isActive ? 'ring-2 ring-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]' : ''}`}>
                  
                  {/* Dynamic Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
                    <img 
                      src={cat.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                  </div>

                  {/* Text Content */}
                  <div className="relative z-10 flex flex-col mt-auto">
                    <h3 className="font-bold text-xl text-white group-hover:text-teal-300 transition-colors drop-shadow-md">{cat.label}</h3>
                    <p className="text-sm text-slate-300 drop-shadow-md">{cat.desc}</p>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Tracklist and Player Container (Client-Side Real-time sync) */}
        <MainTracksContainer 
          initialTracks={tracks} 
          currentCategory={currentCategory} 
          userFavorites={userFavorites} 
          isLoggedIn={isLoggedIn} 
        />
      </main>

    </div>
  );
}
