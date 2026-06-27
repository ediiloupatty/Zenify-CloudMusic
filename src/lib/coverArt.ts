// Auto cover-art lookup.
//
// Tracks downloaded without embedded artwork get a cover fetched from free,
// keyless public catalogs — iTunes Search first, then Deezer as a fallback for
// wider coverage. The fetch happens SERVER-SIDE (so it isn't subject to the
// user's ISP blocking external image hosts the way the browser is); the image
// is then stored in R2 and served through the existing /api/cover proxy.
//
// Every lookup is best-effort: any miss / timeout / network error returns null
// and callers must treat a missing cover as non-fatal.

const TIMEOUT_MS = 8000;

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > 0 ? buf : null;
  } catch {
    return null;
  }
}

// iTunes returns a 100px thumbnail URL; bump it to a crisp 600px square.
async function findOnItunes(term: string, entity: "album" | "song"): Promise<string | null> {
  const data = await fetchJson(
    `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=1`
  );
  const art = data?.results?.[0]?.artworkUrl100 as string | undefined;
  if (!art) return null;
  return art.replace(/\/\d+x\d+bb\.(jpg|png)$/i, "/600x600bb.$1");
}

async function findOnDeezer(term: string): Promise<string | null> {
  const data = await fetchJson(
    `https://api.deezer.com/search/album?q=${encodeURIComponent(term)}&limit=1`
  );
  const r = data?.data?.[0];
  return r?.cover_xl || r?.cover_big || r?.cover_medium || null;
}

export type CoverQuery = { artist?: string | null; album?: string | null; title?: string | null };

// Resolve the best matching cover and return its downloaded bytes, or null.
// Prefers album art (one image covers the whole record); falls back to the
// track title when there's no album tag.
export async function fetchCoverArt(
  q: CoverQuery
): Promise<{ data: Buffer; source: "itunes" | "deezer" } | null> {
  const artist = (q.artist || "").trim();
  const album = (q.album || "").trim();
  const title = (q.title || "").trim();

  const candidates: { term: string; entity: "album" | "song" }[] = [];
  if (artist && album) candidates.push({ term: `${artist} ${album}`, entity: "album" });
  else if (album) candidates.push({ term: album, entity: "album" });
  if (artist && title) candidates.push({ term: `${artist} ${title}`, entity: "song" });
  else if (title) candidates.push({ term: title, entity: "song" });
  if (!candidates.length) return null;

  for (const c of candidates) {
    const itunesUrl = await findOnItunes(c.term, c.entity);
    if (itunesUrl) {
      const data = await downloadImage(itunesUrl);
      if (data) return { data, source: "itunes" };
    }
    const deezerUrl = await findOnDeezer(c.term);
    if (deezerUrl) {
      const data = await downloadImage(deezerUrl);
      if (data) return { data, source: "deezer" };
    }
  }
  return null;
}
