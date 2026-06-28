import Sidebar from "@/components/Sidebar";
import DynamicBackground from "@/components/DynamicBackground";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen font-sans overflow-hidden relative gap-2"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <DynamicBackground />
      <Sidebar currentCategory={null} />

      {/* ─── MAIN AREA ────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-44">
          {children}
        </div>
      </div>
    </div>
  );
}
