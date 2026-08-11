"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"cyberpunk" | "minimal" | "developer">("cyberpunk");

  return (
    <main className="relative min-h-screen bg-[#07070a] text-white overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Immersive Cyberpunk & Aurora Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[160px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto border-b border-white/10 backdrop-blur-xl bg-[#07070a]/60 sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Custom Logo Image (Make sure file extension matches logo.png or logo.svg in public folder) */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition duration-300 bg-black/40 flex items-center justify-center">
            <img
              src="/logo.png" 
              alt="PortfolioAI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg leading-none font-extrabold tracking-wide">
              FolioCraft<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400"></span>
            </span>
            
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/admin/login"
            className="hidden sm:flex px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-500/20 transition items-center gap-1.5 font-mono shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          >
            🔒 Admin Portal
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition duration-200"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition shadow-lg shadow-purple-600/25 active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/30 text-xs font-mono text-purple-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
          Powered by Gemini AI & Next.js
        </div>

        {/* Dynamic Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
          Transform your static resume into a <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
            living developer portfolio.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
          Upload your resume. Our advanced AI parses your projects, experience, and tech stack into a lightning-fast, highly responsive website in seconds.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 font-semibold text-sm text-white shadow-xl shadow-purple-600/30 hover:shadow-2xl hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Build My Portfolio Free →
          </Link>

          <Link
            href="/preview"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 font-semibold text-sm backdrop-blur-md transition duration-200"
          >
            Preview Live Template
          </Link>
        </div>

        {/* Interactive Theme Showcase Box */}
        <div className="mt-16 relative rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-2xl shadow-2xl shadow-purple-950/50">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="ml-3 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-md hidden sm:block">
                portfolio-ai.app/v/candidate
              </div>
            </div>

            {/* Theme Toggle Tabs */}
            <div className="flex gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button 
                onClick={() => setActiveTab("cyberpunk")}
                className={`px-3 py-1 rounded-lg transition ${activeTab === "cyberpunk" ? "bg-purple-600/40 border border-purple-500/40 text-purple-200 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Cyberpunk
              </button>
              <button 
                onClick={() => setActiveTab("minimal")}
                className={`px-3 py-1 rounded-lg transition ${activeTab === "minimal" ? "bg-white/20 text-white font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Minimal
              </button>
              <button 
                onClick={() => setActiveTab("developer")}
                className={`px-3 py-1 rounded-lg transition ${activeTab === "developer" ? "bg-blue-600/40 border border-blue-500/40 text-blue-200 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Developer
              </button>
            </div>
          </div>

          {/* Dynamic Mockup Content Box */}
          <div className="rounded-xl bg-[#0b0b10] border border-white/10 p-6 md:p-8 text-left transition-all duration-300">
            {activeTab === "cyberpunk" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Karthik S Kulal</h3>
                    <p className="text-xs text-purple-400 font-mono">AI & ML Engineer</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono">Active Theme</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Python", "Machine Learning", "PyTorch", "Next.js", "TailwindCSS"].map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-200 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "minimal" && (
              <div className="space-y-4 animate-fadeIn bg-white text-slate-900 p-6 rounded-lg">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-light tracking-tight">Karthik S Kulal</h3>
                  <p className="text-xs text-gray-500 font-sans">Minimalist Portfolio Variant</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["TypeScript", "React", "Data Science", "UI/UX"].map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "developer" && (
              <div className="space-y-3 animate-fadeIn font-mono text-xs">
                <p className="text-emerald-400">$ cat ./profile.json</p>
                <div className="p-3 rounded bg-[#161b22] border border-[#30363d] text-gray-300 space-y-1">
                  <p><span className="text-purple-400">&quot;name&quot;:</span> &quot;Karthik S Kulal&quot;</p>
                  <p><span className="text-purple-400">&quot;role&quot;:</span> &quot;AI & ML Engineering Student&quot;</p>
                  <p><span className="text-purple-400">&quot;stack&quot;:</span> [&quot;Python&quot;, &quot;TensorFlow&quot;, &quot;Next.js&quot;]</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">How PortfolioAI Works</h2>
          <p className="text-gray-400 text-sm">Three effortless steps to a world-class professional presence.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            step="01"
            title="Upload Resume"
            description="Drag and drop your PDF or Word document. We automatically extract clean structured data."
          />

          <FeatureCard
            iconPath="M13 10V3L4 14h7v7l9-11h-7z"
            step="02"
            title="AI Extraction"
            description="Gemini intelligence organizes work history, skills, and impactful metrics instantly."
          />

          <FeatureCard
            iconPath="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            step="03"
            title="Instant Deploy & Export"
            description="Switch between breathtaking themes, export to PDF, or download raw standalone HTML code."
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-white/10 bg-[#040406] text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-purple-500/35 shadow-md flex items-center justify-center bg-black/40">
                <img
                  src="/logo.png"
                  alt="PortfolioAI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base font-extrabold text-white tracking-wide">
                FolioCraft<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"></span>
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-xs text-center md:text-left">
              Empowering developers and engineering students to turn static resumes into high-performance web showcases instantly.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h4 className="text-white font-mono uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/register" className="hover:text-white transition">Get Started</Link></li>
              <li><Link href="/preview" className="hover:text-white transition">Live Preview</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Col 3: Templates */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h4 className="text-white font-mono uppercase tracking-wider text-[11px]">Templates</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-500">Cyberpunk Theme</span></li>
              <li><span className="text-gray-500">Minimalist Theme</span></li>
              <li><span className="text-gray-500">Developer Terminal Theme</span></li>
            </ul>
          </div>

        </div>

        {/* Centered Developed By Credit & Bottom Bar */}
        <div className="border-t border-white/5 py-8 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-3.5 px-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 font-mono text-xs shadow-inner">
            <p className="text-gray-400">Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-bold">Karthik S Kulal</span></p>
            <p className="text-[10px] text-gray-500">AI & ML Engineering • Karavali Institute of Technology</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-4 border-t border-white/5 text-gray-500 font-mono text-[11px] gap-2">
            <p>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</p>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}

function FeatureCard({
  iconPath,
  step,
  title,
  description,
}: {
  iconPath: string;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl hover:border-purple-500/40 hover:bg-black/60 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
          </svg>
        </div>
        <span className="text-xs font-mono font-bold text-gray-500 group-hover:text-purple-400 transition">{step}</span>
      </div>

      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-300 transition">
        {title}
      </h3>

      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}