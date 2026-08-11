"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PortfolioData {
  name: string;
  username: string;
  template_theme: "cyberpunk" | "minimal" | "developer";
  skills: { id: number; name: string }[];
  projects: { id: number; title: string; description: string; image_url?: string; link?: string }[];
  experiences: { id: number; company: string; role: string; duration: string }[];
}

export default function PublicPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch(`${API_URL}/api/portfolio/public/${resolvedParams.username}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [resolvedParams.username]);

  if (loading) return <div className="min-h-screen bg-[#07070a] text-white flex items-center justify-center">Loading portfolio...</div>;
  if (!data) return notFound();

  // Theme 1: Cyberpunk Dark Theme
  if (data.template_theme === "cyberpunk") {
    return (
      <main className="min-h-screen bg-[#07070a] text-white p-8 max-w-5xl mx-auto space-y-12">
        <header className="border-b border-purple-500/30 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            {data.name}
          </h1>
          <p className="text-gray-400 mt-1">@{data.username}</p>
        </header>

        <section>
          <h2 className="text-xl font-bold text-purple-400 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s.id} className="px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-lg text-sm text-purple-200">
                {s.name}
              </span>
            ))}
          </div>
        </section>

        {data.experiences && data.experiences.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-purple-400 mb-4">Experience</h2>
            <div className="space-y-4">
              {data.experiences.map((e) => (
                <div key={e.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">{e.role} @ {e.company}</h3>
                    <span className="text-xs text-purple-400">{e.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-purple-400 mb-4">Projects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.projects.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h3 className="font-bold text-lg text-white">{p.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // Theme 2: Minimal Light Theme
  if (data.template_theme === "minimal") {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 p-8 max-w-4xl mx-auto space-y-12">
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-light text-slate-900">{data.name}</h1>
          <p className="text-slate-500 mt-1">@{data.username}</p>
        </header>

        <section>
          <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s.id} className="px-3 py-1 bg-slate-200 text-slate-800 rounded text-sm">
                {s.name}
              </span>
            ))}
          </div>
        </section>

        {data.experiences && data.experiences.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Experience</h2>
            <div className="space-y-4">
              {data.experiences.map((e) => (
                <div key={e.id} className="p-4 border-l-2 border-slate-900 bg-white shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">{e.role} @ {e.company}</h3>
                  </div>
                  <span className="text-xs text-slate-500">{e.duration}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((p) => (
              <div key={p.id} className="p-4 border-l-2 border-slate-900 bg-white shadow-sm">
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // Theme 3: Developer Grid Theme
  return (
    <main className="min-h-screen bg-slate-950 text-emerald-400 font-mono p-8 max-w-6xl mx-auto space-y-8">
      <header className="border-b border-emerald-500/20 pb-4">
        <h1 className="text-3xl font-bold">&gt; {data.name}_</h1>
        <p className="text-xs text-emerald-600">[{data.username}]</p>
      </header>

      <section>
        <h2 className="text-sm font-bold text-emerald-500 mb-3">// SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s.id} className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded text-xs">
              {s.name}
            </span>
          ))}
        </div>
      </section>

      {data.experiences && data.experiences.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-emerald-500 mb-3">// EXPERIENCE</h2>
          <div className="space-y-2">
            {data.experiences.map((e) => (
              <div key={e.id} className="p-3 border border-emerald-500/20 rounded bg-emerald-950/20 flex justify-between items-center text-xs">
                <span className="text-emerald-300 font-bold">{e.role} @ {e.company}</span>
                <span className="text-emerald-500">{e.duration}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-bold text-emerald-500 mb-3">// PROJECTS</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {data.projects.map((p) => (
            <div key={p.id} className="p-4 border border-emerald-500/20 rounded bg-emerald-950/20">
              <h3 className="font-bold text-emerald-300">{p.title}</h3>
              <p className="text-xs text-emerald-400/80 mt-2">{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}