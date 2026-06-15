"use client";

import Link from "next/link";

export default function SignUp() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#D1FAE5] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <i className="ti ti-user-plus text-3xl text-[#10B981]"></i>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Create Account</h1>
            <p className="text-[#64748b] mt-2 text-sm md:text-base">Start optimizing your catalog for free</p>
          </div>

          <form>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-[#0f172a] mb-2">First Name</label>
                <input type="text" className="input-control" placeholder="John" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f172a] mb-2">Last Name</label>
                <input type="text" className="input-control" placeholder="Doe" required />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Email Address</label>
              <input type="email" className="input-control" placeholder="you@example.com" required />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Password</label>
              <input type="password" className="input-control" placeholder="Min. 8 characters" required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Primary Marketplace</label>
              <select className="input-control">
                <option>Meesho</option>
                <option>Flipkart</option>
                <option>Amazon India</option>
                <option>Shopsy</option>
                <option>GlowRoad</option>
              </select>
            </div>
            
            <Link href="/dashboard" className="btn btn-primary w-full py-4 text-base shadow-lg shadow-[#7C3AED]/20">
              Create Free Account
            </Link>
          </form>

          <p className="text-center mt-8 text-sm text-[#64748b]">
            Already have an account? <Link href="/signin" className="text-[#7C3AED] font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
