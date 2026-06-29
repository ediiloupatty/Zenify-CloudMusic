"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { deleteAccountAction } from "@/app/actions/settings";

export default function DeleteAccountPage() {
  const [state, formAction, isPending] = useActionState(deleteAccountAction, null);
  const [confirmation, setConfirmation] = useState("");

  const isConfirmed = confirmation === "DELETE";

  return (
    <div
      className="flex flex-col"
      style={{ color: "var(--text-primary)" }}
    >
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
        <h1 className="text-xl font-bold" style={{ color: "#ef4444" }}>
          Delete Account
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 py-6 pb-48 max-w-lg mx-auto w-full">
        {/* Warning Banner */}
        <div
          className="rounded-2xl px-5 py-5 mb-6 flex gap-4"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <div className="flex-shrink-0 mt-0.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: "#ef4444" }}>
              This action is permanent
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Deleting your account will permanently remove all your data including your playlists, favorites, and listening history. This cannot be undone.
            </p>
          </div>
        </div>

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
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Confirm Your Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
              placeholder="Enter your password"
            />
          </div>

          {/* Type DELETE */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Type <span style={{ color: "#ef4444" }}>DELETE</span> to confirm
            </label>
            <input
              type="text"
              name="confirmation"
              required
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: `1px solid ${isConfirmed ? "rgba(239,68,68,0.5)" : "var(--border-card)"}`,
              }}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={isPending || !isConfirmed}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#ef4444" }}
            >
              {isPending ? "Deleting..." : "Delete My Account"}
            </button>

            <Link
              href="/settings"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:opacity-80 active:scale-[0.98]"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-card)" }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
