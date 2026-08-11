"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  title: string;
  description: string;
}

interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
}

export default function PreviewPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [templateTheme, setTemplateTheme] = useState<"cyberpunk" | "minimal" | "developer">("cyberpunk");

  // Portfolio Data States
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Load portfolio data and theme strictly from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.experiences) setExperiences(parsed.experiences);
      } catch (err) {
        console.error("Failed to parse portfolio data", err);
      }
    }

    const savedTheme = localStorage.getItem("templateTheme") as "cyberpunk" | "minimal" | "developer";
    if (savedTheme) {
      setTemplateTheme(savedTheme);
    }

    setLoading(false);
  }, []);

  // Feature: Download Standalone HTML File
  function handleDownloadHTML() {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName || "Portfolio"} - ${username || "User"}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#07070a] text-white min-h-screen p-8 md:p-16">
    <div class="max-w-4xl mx-auto space-y-12">
        <header class="border-b border-white/10 pb-6 space-y-2">
            <h1 class="text-4xl font-bold">${fullName || "Portfolio Profile"}</h1>
            <p class="text-purple-400 text-sm">@${username || "user"}</p>
        </header>

        <section class="space-y-3">
            <h2 class="text-xs uppercase tracking-widest text-purple-400 font-mono">Skills</h2>
            <div class="flex flex-wrap gap-2">
                ${skills.map((s) => `<span class="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono">${s}</span>`).join("")}
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xs uppercase tracking-widest text-purple-400 font-mono">Experience</h2>
            <div class="space-y-3">
                ${experiences.map((e) => `
                    <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-sm">${e.role}</h3>
                            <span class="text-xs text-purple-400 font-mono">${e.duration}</span>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">${e.company}</p>
                    </div>
                `).join("")}
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xs uppercase tracking-widest text-purple-400 font-mono">Projects</h2>
            <div class="grid md:grid-cols-2 gap-4">
                ${projects.map((p) => `
                    <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <h3 class="font-bold text-sm">${p.title}</h3>
                        <p class="text-xs text-gray-400">${p.description}</p>
                    </div>
                `).join("")}
            </div>
        </section>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${username || "portfolio"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex items-center justify-center">
        <p className="text-sm text-purple-400 animate-pulse">Loading portfolio preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Top Floating Control Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#07070a]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition text-gray-300"
          >
            ← Back to Dashboard
          </button>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Viewing as: <strong className="text-purple-400">@{username || "user"}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector */}
          <select
            value={templateTheme}
            onChange={(e) => {
              const newTheme = e.target.value as "cyberpunk" | "minimal" | "developer";
              setTemplateTheme(newTheme);
              localStorage.setItem("templateTheme", newTheme);
            }}
            className="px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-white outline-none capitalize"
          >
            <option value="cyberpunk">Cyberpunk Theme</option>
            <option value="minimal">Minimal Theme</option>
            <option value="developer">Developer Theme</option>
          </select>

          {/* Edit Portfolio Button */}
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 transition"
          >
            ✏️ Edit Portfolio
          </button>

          {/* Download HTML Button */}
          <button
            onClick={handleDownloadHTML}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 transition"
          >
            📥 Download HTML
          </button>

          {/* Export PDF Button */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 transition text-white"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Render Theme Variant */}
      <div className="pt-16">
        {templateTheme === "cyberpunk" && <CyberpunkTheme fullName={fullName} username={username} skills={skills} projects={projects} experiences={experiences} />}
        {templateTheme === "minimal" && <MinimalTheme fullName={fullName} username={username} skills={skills} projects={projects} experiences={experiences} />}
        {templateTheme === "developer" && <DeveloperTheme fullName={fullName} username={username} skills={skills} projects={projects} experiences={experiences} />}
      </div>
    </div>
  );
}

// --- THEME 1: CYBERPUNK ---
function CyberpunkTheme({ fullName, username, skills, projects, experiences }: { fullName: string; username: string; skills: string[]; projects: Project[]; experiences: Experience[] }) {
  return (
    <main className="min-h-screen bg-[#07070a] text-white p-8 md:p-16 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <header className="border-b border-purple-500/20 pb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest">
            Portfolio Profile
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            {fullName || "Name Not Found"}
          </h1>
          <p className="text-gray-400 text-sm max-w-xl font-mono">
            Professional portfolio extracted directly from verified data.
          </p>
        </header>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase text-purple-400 tracking-wider">// Core Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-500 font-mono italic">No skills listed.</p>
            )}
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase text-purple-400 tracking-wider">// Experience</h2>
          <div className="space-y-4">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <div key={exp.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/50 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <span className="text-xs text-purple-400 font-mono">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{exp.company}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 font-mono italic">No experience records found.</p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase text-purple-400 tracking-wider">// Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/50 transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                    <p className="text-xs text-gray-400 mt-2">{proj.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 font-mono italic">No project entries detected.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// --- THEME 2: MINIMAL ---
function MinimalTheme({ fullName, username, skills, projects, experiences }: { fullName: string; username: string; skills: string[]; projects: Project[]; experiences: Experience[] }) {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 md:p-20">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="space-y-2 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-light tracking-tight">{fullName || "Name Not Found"}</h1>
          <p className="text-sm text-gray-500">Curated Portfolio</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No skills available.</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Experience</h2>
          <div className="space-y-6">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{exp.role} — <span className="text-gray-500">{exp.company}</span></span>
                    <span className="text-xs text-gray-400">{exp.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No experience records available.</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Projects</h2>
          <div className="space-y-6">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <h3 className="text-sm font-semibold">{proj.title}</h3>
                  <p className="text-xs text-gray-600">{proj.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No project entries available.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// --- THEME 3: DEVELOPER ---
function DeveloperTheme({ fullName, username, skills, projects, experiences }: { fullName: string; username: string; skills: string[]; projects: Project[]; experiences: Experience[] }) {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 md:p-16 font-mono">
      <div className="max-w-3xl mx-auto space-y-8 bg-[#161b22] border border-[#30363d] rounded-xl p-6 md:p-10 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[#30363d] pb-4 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className="ml-2">portfolio@{username || "candidate"}: ~</span>
        </div>

        <div className="space-y-2">
          <p className="text-emerald-400 text-sm">$ cat ./profile.md</p>
          <h1 className="text-2xl font-bold text-white"># {fullName || "Name Not Found"}</h1>
          <p className="text-xs text-gray-400">Profile parsed successfully.</p>
        </div>

        <div className="space-y-2">
          <p className="text-emerald-400 text-sm">$ ls ./skills</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.length > 0 ? (
              skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-[#21262d] border border-[#30363d] text-xs text-blue-300">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 italic">No skills found</span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-emerald-400 text-sm">$ cat ./experience.json</p>
          <div className="space-y-2 text-xs">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <div key={exp.id} className="p-3 rounded bg-[#21262d] border border-[#30363d]">
                  <span className="text-purple-400">{exp.role}</span> @ <span className="text-yellow-300">{exp.company}</span> ({exp.duration})
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No experience records found</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-emerald-400 text-sm">$ cat ./projects.json</p>
          <div className="space-y-2 text-xs">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded bg-[#21262d] border border-[#30363d]">
                  <span className="text-blue-400 font-bold">{proj.title}</span>: {proj.description}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No project entries found</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}