"use client";

import Link from "next/link";

export default function SignIn() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#EDE9FE] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 38 38" fill="none">
                  <rect x="8" y="8" width="10" height="10" rx="2" fill="rgba(124, 58, 237, 0.4)"/>
                  <rect x="20" y="8" width="10" height="10" rx="2" fill="rgba(124, 58, 237, 0.7)"/>
                  <rect x="8" y="20" width="10" height="10" rx="2" fill="rgba(124, 58, 237, 0.7)"/>
                  <rect x="20" y="20" width="10" height="10" rx="2" fill="var(--color-primary)"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Welcome Back</h1>
            <p className="text-[#64748b] mt-2 text-sm md:text-base">Sign in to your CatalogIQ account</p>
          </div>

          <form>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Email Address</label>
              <input type="email" className="input-control" placeholder="you@example.com" required />
            </div>
            <div className="mb-6">
              <label className="flex justify-between text-sm font-semibold text-[#0f172a] mb-2">
                Password
                <a href="#" className="text-[#7C3AED] font-medium text-sm hover:underline">Forgot?</a>
              </label>
              <input type="password" className="input-control" placeholder="••••••••" required />
            </div>
            
            <Link href="/dashboard" className="btn btn-primary w-full py-4 text-base shadow-lg shadow-[#7C3AED]/20">
              Sign In
            </Link>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2e8f0]"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-[#94a3b8] font-medium">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-[#e2e8f0] rounded-xl font-semibold text-sm text-[#0f172a] hover:border-[#7C3AED] hover:bg-[#f8fafc] transition-all">
              <i className="ti ti-brand-google text-lg"></i> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-[#e2e8f0] rounded-xl font-semibold text-sm text-[#0f172a] hover:border-[#7C3AED] hover:bg-[#f8fafc] transition-all">
              <i className="ti ti-brand-github text-lg"></i> GitHub
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-[#64748b]">
            Don't have an account? <Link href="/signup" className="text-[#7C3AED] font-bold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
