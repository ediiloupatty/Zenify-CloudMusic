import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const artist = searchParams.get("artist") || "";
  const title = searchParams.get("title") || "";

  const effectiveTitle = title || q;
  if (!effectiveTitle) {
    return NextResponse.json({ error: "Missing query or title" }, { status: 400 });
  }

  const headers = {
    "User-Agent": "Zenify Cloud Player (https://github.com/ediiloupatty/Zenify)"
  };

  try {
    // 1. Try exact match using /api/get if both artist and title are provided
    if (artist && title) {
      const getRes = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`, {
        headers,
        signal: AbortSignal.timeout(5000),
        cache: 'no-store'
      });
      if (getRes.ok) {
        const data = await getRes.json();
        if (data && (data.syncedLyrics || data.plainLyrics)) {
          return NextResponse.json({ syncedLyrics: data.syncedLyrics || data.plainLyrics }, {
            headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
          });
        }
      }
    }

    // 2. Try search using artist + title (or q)
    const searchQuery = artist ? `${artist} ${title}` : effectiveTitle;
    const searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`, {
      headers,
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const syncedResult = data.find((item: any) => item.syncedLyrics && item.syncedLyrics.length > 0);
        if (syncedResult) {
          return NextResponse.json({ syncedLyrics: syncedResult.syncedLyrics }, {
            headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
          });
        }
        const plainResult = data.find((item: any) => item.plainLyrics && item.plainLyrics.length > 0);
        if (plainResult) {
          return NextResponse.json({ syncedLyrics: plainResult.plainLyrics }, {
            headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
          });
        }
      }
    }

    // 3. Fallback: Try search using ONLY the title (in case artist string caused a mismatch)
    if (artist) {
      const titleRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(title)}`, {
        headers,
        signal: AbortSignal.timeout(5000),
        cache: 'no-store'
      });
      if (titleRes.ok) {
        const data = await titleRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const syncedResult = data.find((item: any) => item.syncedLyrics && item.syncedLyrics.length > 0);
          if (syncedResult) {
            return NextResponse.json({ syncedLyrics: syncedResult.syncedLyrics }, {
              headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
            });
          }
          const plainResult = data.find((item: any) => item.plainLyrics && item.plainLyrics.length > 0);
          if (plainResult) {
            return NextResponse.json({ syncedLyrics: plainResult.plainLyrics }, {
              headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
            });
          }
        }
      }
    }

    return NextResponse.json({ syncedLyrics: null }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
    });
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json({ syncedLyrics: null }, {
      status: 200,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
    });
  }
}
