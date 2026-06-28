import Link from "next/link";
import { auth } from "@/auth";
import BrowseShell from "@/components/BrowseShell";
import { getUserFavorites, getFavoriteTracks, Track } from "@/lib/cloudflare";
import MainTracksContainer from "@/components/MainTracksContainer";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, var(--accent), #6366f1)" }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Your Favorites
          </h2>
          <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
            Sign in to save and access your favorite tracks from any device.
          </p>
        </div>
        <Link
          href="/login"
          className="px-8 py-3 rounded-full font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}
        >
          Sign In
        </Link>
        <Link href="/" className="text-sm" style={{ color: "var(--text-muted)" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const [userFavorites, favoriteTracks] = await Promise.all([
    session.user?.email ? getUserFavorites(session.user.email) : Promise.resolve([]),
    session.user?.email ? getFavoriteTracks(session.user.email) : Promise.resolve([]),
  ]);

  return (
    <BrowseShell>
      <h1 className="text-xl font-black mb-5" style={{ color: "var(--text-primary)" }}>
        Favorites
      </h1>

      {favoriteTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--bg-secondary)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="font-semibold text-base" style={{ color: "var(--text-secondary)" }}>
            No favorites yet
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Tap the heart icon on any track to save it here.
          </p>
          <Link
            href="/"
            className="mt-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white"
            style={{ background: "var(--accent)" }}
          >
            Explore Music
          </Link>
        </div>
      ) : (
        <MainTracksContainer
          initialTracks={favoriteTracks}
          currentCategory={null}
          userFavorites={userFavorites}
          isLoggedIn={isLoggedIn}
          columns
        />
      )}
    </BrowseShell>
  );
}
