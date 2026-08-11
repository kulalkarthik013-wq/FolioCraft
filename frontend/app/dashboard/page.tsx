"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

export default function CompleteDashboard() {
  const router = useRouter();
  const [username] = useState("karthik");
  const [isPublished, setIsPublished] = useState(false);
  const [templateTheme, setTemplateTheme] = useState<"cyberpunk" | "minimal" | "developer">("cyberpunk");

  // Resume Upload States
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Portfolio Data States
  const [skills, setSkills] = useState<string[]>(["Python", "React", "Next.js"]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: "PairCoder", description: "AI Pair programming assistant" },
    { id: 2, title: "GymExpert", description: "Workout tracking platform" },
  ]);
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: 1, company: "Tech Corp", role: "AI Fellow", duration: "2025 - Present" },
  ]);

  // Form Inputs for Manual CRUD
  const [newSkill, setNewSkill] = useState("");
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpDuration, setNewExpDuration] = useState("");

  // Load existing data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.projects) {
          setProjects(
            parsed.projects.map((p: any, idx: number) => ({
              id: p.id || Date.now() + idx,
              title: p.title || "",
              description: p.description || "",
            }))
          );
        }
        if (parsed.experiences) {
          setExperiences(
            parsed.experiences.map((e: any, idx: number) => ({
              id: e.id || Date.now() + idx,
              company: e.company || "",
              role: e.role || "",
              duration: e.duration || "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to parse local portfolio data", err);
      }
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    const portfolioPayload = { skills, projects, experiences };
    localStorage.setItem("portfolioData", JSON.stringify(portfolioPayload));
  }, [skills, projects, experiences]);

  // Handle Resume Selection
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  // Handle Resume AI Parse & Upload
  async function handleResumeUpload() {
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to parse resume.");

      const parsedData = await res.json();

      const formattedProjects = (parsedData.projects || []).map((p: any, idx: number) => ({
        id: p.id || Date.now() + idx,
        title: p.title || "",
        description: p.description || "",
      }));

      const formattedExperiences = (parsedData.experiences || []).map((e: any, idx: number) => ({
        id: e.id || Date.now() + idx,
        company: e.company || "",
        role: e.role || "",
        duration: e.duration || "",
      }));

      const updatedSkills = parsedData.skills || skills;

      setSkills(updatedSkills);
      setProjects(formattedProjects);
      setExperiences(formattedExperiences);

      setUploadMessage("✨ Portfolio generated successfully from resume!");
      setFile(null);
    } catch (err: any) {
      setUploadMessage(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  // Toggle Publish Status
  async function togglePublish() {
    const nextState = !isPublished;
    setIsPublished(nextState);
    try {
      await fetch(`${API_URL}/api/portfolio/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: nextState }),
      });
    } catch (err) {
      console.error("Failed to update publish status", err);
    }
  }

  // Theme Switcher
  async function changeTheme(theme: "cyberpunk" | "minimal" | "developer") {
    setTemplateTheme(theme);
    try {
      await fetch(`${API_URL}/api/portfolio/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_theme: theme }),
      });
    } catch (err) {
      console.error("Failed to update theme", err);
    }
  }

  // CRUD Helpers
  function handleAddSkill() {
    if (!newSkill.trim()) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  }

  function handleAddProject() {
    if (!newProjTitle.trim()) return;
    setProjects([...projects, { id: Date.now(), title: newProjTitle, description: newProjDesc }]);
    setNewProjTitle("");
    setNewProjDesc("");
  }

  function handleAddExperience() {
    if (!newExpCompany.trim() || !newExpRole.trim()) return;
    setExperiences([...experiences, { id: Date.now(), company: newExpCompany, role: newExpRole, duration: newExpDuration }]);
    setNewExpCompany("");
    setNewExpRole("");
    setNewExpDuration("");
  }

  // Key Down Handlers for better UX
  function handleKeyDown(e: KeyboardEvent, action: () => void) {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/portfolio/${username}` : `/portfolio/${username}`;

  return (
    <main className="min-h-screen w-full bg-[#07070a] text-white p-6 md:p-12 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Karthik 👋</h1>
            <p className="text-sm text-gray-400 mt-1">Upload your resume to generate your AI portfolio or edit sections manually</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/preview")}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 transition"
            >
              👁 Preview Page
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/10 transition"
            >
              📄 Export PDF
            </button>

            <button
              onClick={togglePublish}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isPublished
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-red-500/20 text-red-400 border border-red-500/40"
              }`}
            >
              {isPublished ? "● Public" : "○ Private"}
            </button>
          </div>
        </div>

        {/* AI RESUME UPLOAD SECTION */}
        <div className="rounded-3xl border border-dashed border-purple-500/30 bg-purple-950/10 backdrop-blur-xl p-8 text-center flex flex-col items-center justify-center hover:border-purple-500/60 transition w-full">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-3">
            📄
          </div>

          <h2 className="text-lg font-semibold text-white">Upload your Resume to Generate Portfolio</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Drag & drop your resume PDF here. Our AI will parse your skills, work history, and projects directly into your chosen theme.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <label className="cursor-pointer">
              <span className="px-5 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition inline-block">
                {file ? file.name : "Choose Resume (PDF)"}
              </span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
            </label>

            {file && (
              <button
                onClick={handleResumeUpload}
                disabled={uploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                {uploading ? "AI Parsing Resume..." : "Generate Portfolio from Resume"}
              </button>
            )}
          </div>

          {uploadMessage && (
            <p className="mt-4 text-xs font-medium text-purple-300">{uploadMessage}</p>
          )}
        </div>

        {/* SETTINGS: Share Link & Theme Selector */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          
          {/* Share Link Card */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <h2 className="text-sm font-semibold uppercase text-purple-400">Portfolio Public Link</h2>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-300 outline-none"
              />
              <button
                onClick={() => navigator.clipboard.writeText(publicUrl)}
                className="px-4 py-2 rounded-lg bg-purple-600/30 border border-purple-500/40 text-xs font-semibold hover:bg-purple-600/50 transition shrink-0"
              >
                Copy
              </button>
            </div>
            <Link href="/preview" className="inline-block text-xs text-purple-400 hover:underline mt-1">
              Preview live portfolio →
            </Link>
          </div>

          {/* Theme Selector Card */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <h2 className="text-sm font-semibold uppercase text-purple-400">Select Template Theme</h2>
            <div className="grid grid-cols-3 gap-2">
              {(["cyberpunk", "minimal", "developer"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => changeTheme(theme)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                    templateTheme === theme
                      ? "border-purple-500 bg-purple-500/20 text-purple-300"
                      : "border-white/10 bg-black/20 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* CRUD EDITORS FOR SKILLS, PROJECTS & EXPERIENCES */}
        <div className="grid md:grid-cols-3 gap-6 w-full">
          
         {/* Skills Editor */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
            <h2 className="text-sm font-semibold uppercase text-purple-400 border-b border-white/10 pb-2">Skills</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddSkill)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs outline-none focus:border-purple-500"
              />
              <button onClick={handleAddSkill} className="px-3 py-2 rounded-xl bg-purple-600 text-xs font-semibold hover:opacity-90 transition">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, index) => (
                <span key={`skill-${index}-${skill}`} className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-xs flex items-center gap-2">
                  {skill}
                  <button onClick={() => setSkills(skills.filter((s) => s !== skill))} className="text-gray-500 hover:text-red-400 text-xs font-bold">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Projects Editor */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
            <h2 className="text-sm font-semibold uppercase text-purple-400 border-b border-white/10 pb-2">Projects</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={newProjTitle}
                onChange={(e) => setNewProjTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddProject)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs outline-none focus:border-purple-500"
              />
              <button onClick={handleAddProject} className="w-full py-2 rounded-xl bg-purple-600 text-xs font-semibold hover:opacity-90 transition">
                Add Project
              </button>
            </div>
            <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
              {projects.map((p, index) => (
                <div key={`project-${p.id || index}`} className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold">{p.title}</h3>
                    <p className="text-[11px] text-gray-400">{p.description}</p>
                  </div>
                  <button onClick={() => setProjects(projects.filter((item) => item.id !== p.id))} className="text-gray-500 hover:text-red-400 text-xs font-bold ml-2">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Editor */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
            <h2 className="text-sm font-semibold uppercase text-purple-400 border-b border-white/10 pb-2">Experience</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Role"
                value={newExpRole}
                onChange={(e) => setNewExpRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={newExpCompany}
                onChange={(e) => setNewExpCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 2024 - Present)"
                value={newExpDuration}
                onChange={(e) => setNewExpDuration(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddExperience)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs outline-none focus:border-purple-500"
              />
              <button onClick={handleAddExperience} className="w-full py-2 rounded-xl bg-purple-600 text-xs font-semibold hover:opacity-90 transition">
                Add Experience
              </button>
            </div>
            <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
              {experiences.map((exp, index) => (
                <div key={`experience-${exp.id || index}`} className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold">{exp.role} @ {exp.company}</h3>
                    <p className="text-[11px] text-gray-400">{exp.duration}</p>
                  </div>
                  <button onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))} className="text-gray-500 hover:text-red-400 text-xs font-bold ml-2">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}