"use client";

import { useState } from "react";
import useSWR from "swr";
import { uploadTrackAction, deleteTrackAction } from "./actions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPage() {
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data, error, mutate } = useSWR('/api/tracks', fetcher, { refreshInterval: 5000 });
  const tracks = data?.tracks || [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const form = e.currentTarget;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const files = Array.from(fileInput.files || []);

    if (files.length === 0) return;

    setUploadProgress({ current: 0, total: files.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Format the title automatically from filename
      const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      const formattedTitle = rawName.replace(/\b\w/g, c => c.toUpperCase());

      // Create separate FormData for each file
      const formData = new FormData();
      formData.append("title", formattedTitle);
      formData.append("category", category);
      formData.append("file", file);

      setUploadProgress({ current: i + 1, total: files.length });
      
      const result = await uploadTrackAction(formData);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    setUploadProgress({ current: 0, total: 0 });
    form.reset();
    mutate(); // Refresh the tracklist

    if (failCount === 0) {
      setMessage({ type: "success", text: `Successfully uploaded ${successCount} track(s)!` });
    } else {
      setMessage({ type: "error", text: `Uploaded ${successCount} tracks, but ${failCount} failed.` });
    }
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm("Are you sure you want to delete this track?")) return;
    setDeletingId(id);
    const result = await deleteTrackAction(id, fileUrl);
    if (result.success) {
      mutate();
    } else {
      alert("Failed to delete track: " + result.error);
    }
    setDeletingId(null);
  }


  return (
    <div className="flex flex-col min-h-screen items-center py-20 px-4 bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Upload Track</h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-teal-500/20 text-teal-300' : 'bg-red-500/20 text-red-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-slate-300">Category</label>
            <select 
              id="category" 
              name="category" 
              required
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500 transition-colors"
            >
              <option value="Deep Coding">Deep Coding</option>
              <option value="Creative Design">Creative Design</option>
              <option value="Routine Tasks">Routine Tasks</option>
              <option value="Relax & Unwind">Relax & Unwind</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="file" className="text-sm font-medium text-slate-300">Audio File (.mp3)</label>
            <input 
              type="file" 
              id="file" 
              name="file" 
              accept=".mp3,audio/mpeg" 
              multiple
              required 
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20"
            />
          </div>

          <button 
            type="submit" 
            disabled={uploadProgress.total > 0}
            className="mt-4 w-full h-12 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold tracking-wide hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploadProgress.total > 0 
              ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}...` 
              : "Upload to Cloudflare"}
          </button>
        </form>
      </div>
      
      <div className="w-full max-w-2xl mt-8 glass-panel p-8 rounded-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Manage Tracks</h2>
        {error && <div className="text-red-400">Failed to load tracks.</div>}
        {!data && !error && <div className="text-slate-400">Loading tracks...</div>}
        
        {tracks.length === 0 && data ? (
          <div className="text-slate-400">No tracks found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {tracks.map((track: any) => (
              <div key={track.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="flex flex-col">
                  <span className="font-bold text-white">{track.title}</span>
                  <span className="text-xs text-slate-400">{track.category}</span>
                </div>
                <button
                  onClick={() => handleDelete(track.id, track.file_url)}
                  disabled={deletingId === track.id}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {deletingId === track.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-slate-500 text-sm">
        <a href="/" className="hover:text-white transition-colors">← Back to Player</a>
      </div>
    </div>
  );
}
