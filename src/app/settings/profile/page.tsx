"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updateProfileAction, getCurrentUserAction } from "@/app/actions/settings";

export default function EditProfilePage() {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  const [user, setUser] = useState<{ name: string; username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUserAction().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Refresh user data after successful update
  useEffect(() => {
    if (state?.success) {
      getCurrentUserAction().then((u) => setUser(u));
    }
  }, [state]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6" style={{ color: "var(--text-primary)" }}>
        <p style={{ color: "var(--text-muted)" }}>You must be logged in to edit your profile.</p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full font-semibold text-sm text-white"
          style={{ background: "var(--accent)" }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <header
        className="flex items-center gap-4 px-5 pt-6 pb-4 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <Link
          href="/settings"
          className="w-9 h-9 rounded-full flex md:hidden items-center justify-center transition-all active:scale-95"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Edit Profile
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 py-6 pb-48 max-w-lg mx-auto w-full">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl text-white mb-3"
            style={{ background: "linear-gradient(135deg, #14b8a6, #06b6d4)" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {user.email}
          </p>
        </div>

        {/* Success Message */}
        {state?.success && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Profile updated successfully.
          </div>
        )}

        {/* Error Message */}
        {state?.error && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Display Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              required
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
              placeholder="Your display name"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={user.username}
              required
              minLength={3}
              pattern="^[a-zA-Z0-9_]+$"
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
              placeholder="your_username"
            />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Letters, numbers, and underscores only.
            </p>
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
            />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Email cannot be changed.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark, #6366f1))" }}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
