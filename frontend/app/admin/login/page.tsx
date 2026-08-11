"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  
  // 👉 YOU CAN EDIT USERNAME AND PASSWORD DIRECTLY HERE IN THE CODE
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "secretpassword123";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple authentication check against hardcoded code credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store a mock session token in localStorage for the admin dashboard check
      localStorage.setItem("adminToken", "valid_admin_session_token");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid admin username or password.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 space-y-6">
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-xs font-semibold text-purple-600 hover:underline mb-2">
            ← Back to Home
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mx-auto font-bold">
            🔒
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Portal Login</h1>
          <p className="text-xs text-slate-500">Enter your credentials to access system user data and uploads.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg shadow-slate-900/10 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Admin Dashboard"}
          </button>
        </form>

      </div>
    </main>
  );
}