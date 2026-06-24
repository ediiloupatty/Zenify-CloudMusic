"use server";

import { toggleFavoriteInD1 } from "@/lib/cloudflare";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(trackId: string, isCurrentlyFavorited: boolean) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "You must be logged in to favorite tracks." };
  }

  try {
    await toggleFavoriteInD1(session.user.email, trackId, isCurrentlyFavorited);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
