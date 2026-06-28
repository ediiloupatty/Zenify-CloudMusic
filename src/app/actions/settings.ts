"use server";

import bcrypt from "bcryptjs";
import { queryD1 } from "@/lib/cloudflare";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

// ── Update Profile (name & username) ────────────────────────────────────────
export async function updateProfileAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be logged in." };
  }

  const name = (formData.get("name") as string)?.trim();
  const username = (formData.get("username") as string)?.trim();

  if (!name || !username) {
    return { error: "Name and username are required." };
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters." };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, and underscores." };
  }

  try {
    // Check if username is taken by another user
    const existing = await queryD1(
      "SELECT id FROM users WHERE username = ? AND email != ?",
      [username, session.user.email]
    );

    if (existing && existing.length > 0) {
      return { error: "Username is already taken." };
    }

    await queryD1(
      "UPDATE users SET name = ?, username = ? WHERE email = ?",
      [name, username, session.user.email]
    );

    revalidatePath("/settings");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

// ── Change Password ─────────────────────────────────────────────────────────
export async function changePasswordAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be logged in." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  try {
    // Verify current password
    const users = await queryD1(
      "SELECT password_hash FROM users WHERE email = ?",
      [session.user.email]
    );

    if (!users || users.length === 0) {
      return { error: "User not found." };
    }

    const isValid = await bcrypt.compare(currentPassword, (users[0] as any).password_hash);
    if (!isValid) {
      return { error: "Current password is incorrect." };
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await queryD1(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [newHash, session.user.email]
    );

    return { success: true };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { error: "Failed to change password. Please try again." };
  }
}

// ── Delete Account ──────────────────────────────────────────────────────────
export async function deleteAccountAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be logged in." };
  }

  const password = formData.get("password") as string;
  const confirmation = formData.get("confirmation") as string;

  if (!password) {
    return { error: "Password is required to delete your account." };
  }

  if (confirmation !== "DELETE") {
    return { error: "Please type DELETE to confirm." };
  }

  try {
    // Verify password
    const users = await queryD1(
      "SELECT password_hash FROM users WHERE email = ?",
      [session.user.email]
    );

    if (!users || users.length === 0) {
      return { error: "User not found." };
    }

    const isValid = await bcrypt.compare(password, (users[0] as any).password_hash);
    if (!isValid) {
      return { error: "Password is incorrect." };
    }

    // Delete user data: favorites, playlists, then user
    await queryD1("DELETE FROM favorites WHERE user_email = ?", [session.user.email]);
    await queryD1("DELETE FROM playlists WHERE user_email = ?", [session.user.email]);
    await queryD1("DELETE FROM users WHERE email = ?", [session.user.email]);

    // Sign out after deletion
    await signOut({ redirectTo: "/login" });

    return { success: true };
  } catch (error: any) {
    // signOut throws a redirect — let it propagate
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Delete account error:", error);
    return { error: "Failed to delete account. Please try again." };
  }
}

// ── Sign Out ────────────────────────────────────────────────────────────────
export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

// ── Get current user info ───────────────────────────────────────────────────
export async function getCurrentUserAction() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  try {
    const users = await queryD1(
      "SELECT name, username, email, created_at FROM users WHERE email = ?",
      [session.user.email]
    );

    if (!users || users.length === 0) return null;

    const user = users[0] as any;
    return {
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
