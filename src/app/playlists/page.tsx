import BrowseShell from "@/components/BrowseShell";
import PlaylistGrid from "@/components/PlaylistGrid";
import { getPlaylists } from "@/lib/cloudflare";

export const revalidate = 30;

export default async function PlaylistsPage() {
  const playlists = await getPlaylists();
  return (
    <BrowseShell>
      <PlaylistGrid heading="Playlists" playlists={playlists} wrap />
    </BrowseShell>
  );
}
