"use client";

import { useActionState } from "react";
import Link from "next/link";
import { changePasswordAction } from "@/app/actions/settings";

export default function ChangePasswordPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, null);

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
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Change Password
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 py-6 pb-48 max-w-lg mx-auto w-full">
        {/* Lock Icon */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-card)", color: "var(--text-secondary)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>
          <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
            Enter your current password and choose a new one.
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
            Password changed successfully.
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
          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              required
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
              placeholder="Enter current password"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>New password</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
              placeholder="At least 6 characters"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-card)",
              }}
              placeholder="Re-enter new password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark, #6366f1))" }}
          >
            {isPending ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
