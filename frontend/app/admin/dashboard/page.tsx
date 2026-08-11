"use client";

import { useEffect, useState } from "react";

interface UserPortfolioRecord {
  name?: string;
  title?: string;
  summary?: string;
  skills?: string[];
  projects?: any[];
  experiences?: any[];
}

export default function AdminDashboardPage() {
  const [portfolio, setPortfolio] = useState<UserPortfolioRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      window.location.href = "/admin/login";
      return;
    }

    // Load portfolio/user data from localStorage
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        setPortfolio(JSON.parse(savedData));
      } catch (err) {
        console.error("Failed to parse local portfolio data", err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] text-slate-900 flex items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Control Panel
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              System overview of registered local user portfolios and generated outputs.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/";
            }}
            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
          >
            Logout Admin
          </button>
        </div>

        {/* User / Portfolio Data Summary Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {portfolio?.name || "Karthik S Kulal"}
                </h2>
                <p className="text-xs text-purple-600 font-mono">
                  {portfolio?.title || "AI & Machine Learning Specialist"}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold">
                ● Active Session Data
              </span>
            </div>

            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Skills Registered
                </span>
                <p className="text-slate-800 font-semibold text-sm">
                  {portfolio?.skills?.length || 0} skills
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Projects Created
                </span>
                <p className="text-slate-800 font-semibold text-sm">
                  {portfolio?.projects?.length || 0} projects
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Experience Records
                </span>
                <p className="text-slate-800 font-semibold text-sm">
                  {portfolio?.experiences?.length || 0} entries
                </p>
              </div>
            </div>

            {/* Bio / Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Portfolio Bio / Introduction
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {portfolio?.summary || "No custom bio description added yet."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}