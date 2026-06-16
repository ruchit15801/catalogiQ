"use client";
import { useState } from "react";
import { useAppData } from "../../lib/store";

export default function AdminCredits() {
  const { data, useCredit } = useAppData();
  const [grantAmt, setGrantAmt] = useState(10);
  const [grantMsg, setGrantMsg] = useState("");
  const creditsRemaining = data.planCredits - data.totalCreditsUsed;
  const usagePct = data.planCredits > 0 ? Math.round((data.totalCreditsUsed / data.planCredits) * 100) : 0;

  const handleGrant = () => {
    // Simulated — credits are managed via store
    setGrantMsg(`✓ ${grantAmt} credits noted (modify planCredits in store for full effect)`);
    setTimeout(() => setGrantMsg(""), 3000);
  };

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Credit Management</h1>
        <p className="text-[#475569] mt-1 text-sm">Monitor credit usage across all users and grant additional credits</p>
      </div>

      {/* Credit overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Total Allocated</div>
          <div className="text-3xl font-black text-[#0A0A14]">{data.planCredits}</div>
          <div className="text-xs text-[#94a3b8] mt-1">Plan credits</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Used</div>
          <div className="text-3xl font-black text-[#F59E0B]">{data.totalCreditsUsed}</div>
          <div className="text-xs text-[#94a3b8] mt-1">{usagePct}% of total</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Remaining</div>
          <div className={`text-3xl font-black ${creditsRemaining > 20 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{creditsRemaining}</div>
          <div className="text-xs text-[#94a3b8] mt-1">{creditsRemaining > 20 ? "Healthy" : "Low — replenish soon"}</div>
        </div>
      </div>

      {/* Usage progress */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-[#0f172a]">Credit Usage</h3>
          <span className="text-sm font-bold text-[#7C3AED]">{usagePct}%</span>
        </div>
        <div className="h-4 bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ${usagePct > 80 ? 'bg-[#EF4444]' : usagePct > 50 ? 'bg-[#F59E0B]' : 'bg-[#7C3AED]'}`}
            style={{ width: `${Math.min(usagePct, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-[#64748b]">
          <span>{data.totalCreditsUsed} used</span>
          <span>{creditsRemaining} remaining</span>
        </div>
      </div>

      {/* Grant credits */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 mb-6">
        <h3 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
          <i className="ti ti-coin-rupee text-[#F59E0B]"></i> Grant Credits
        </h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#64748b] mb-2">Amount to Grant</label>
            <input
              type="number" min={1} max={1000}
              value={grantAmt}
              onChange={e => setGrantAmt(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none text-sm"
            />
          </div>
          <button
            onClick={handleGrant}
            className="px-5 py-2.5 bg-[#7C3AED] text-white font-bold rounded-lg hover:bg-[#5B21B6] transition-colors text-sm"
          >
            Grant Credits
          </button>
        </div>
        {grantMsg && <div className="mt-3 text-sm text-[#10B981] font-semibold">{grantMsg}</div>}
      </div>

      {/* Optimization breakdown */}
      <div className="bg-[#0A0A14] rounded-xl p-5 text-white">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-4">Credit Consumption by Type</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-[#64748b] mb-1">Image Optimizations</div>
            <div className="text-2xl font-black text-[#10B981]">{data.optimizations.length}</div>
            <div className="text-xs text-[#64748b] mt-1">1 credit each</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-[#64748b] mb-1">AI Generations</div>
            <div className="text-2xl font-black text-[#A78BFA]">{data.aiGenerations.length}</div>
            <div className="text-xs text-[#64748b] mt-1">1 credit each</div>
          </div>
        </div>
      </div>
    </div>
  );
}
