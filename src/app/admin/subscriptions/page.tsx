"use client";
import { useAppData } from "../../lib/store";

const PLANS = [
  { id: "free", name: "Free", price: 0, users: 1, color: "#64748b", bg: "#f1f5f9" },
  { id: "starter", name: "Starter", price: 299, users: 1, color: "#D97706", bg: "#FEF3C7" },
  { id: "pro", name: "Pro", price: 999, users: 3, color: "#7C3AED", bg: "#EDE9FE" },
  { id: "agency", name: "Agency", price: 2999, users: 1, color: "#10B981", bg: "#D1FAE5" },
];

export default function AdminSubscriptions() {
  const { data } = useAppData();
  const totalRevenue = PLANS.reduce((s, p) => s + p.price * p.users, 0);
  const paidUsers = PLANS.filter(p => p.id !== "free").reduce((s, p) => s + p.users, 0);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Subscriptions</h1>
        <p className="text-[#475569] mt-1 text-sm">Revenue overview and plan distribution</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">MRR</div>
          <div className="text-3xl font-black text-[#10B981]">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-[#94a3b8] mt-1">Monthly Recurring</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">ARR</div>
          <div className="text-3xl font-black text-[#7C3AED]">₹{(totalRevenue * 12).toLocaleString()}</div>
          <div className="text-xs text-[#94a3b8] mt-1">Annual Recurring</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Paid Users</div>
          <div className="text-3xl font-black text-[#0A0A14]">{paidUsers}</div>
          <div className="text-xs text-[#94a3b8] mt-1">Across all plans</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Optimizations</div>
          <div className="text-3xl font-black text-[#F59E0B]">{data.optimizations.length}</div>
          <div className="text-xs text-[#94a3b8] mt-1">This session</div>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {PLANS.map(plan => (
          <div key={plan.id} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: plan.bg, color: plan.color }}>
                {plan.name[0]}
              </div>
              <span className="text-xs font-bold" style={{ color: plan.color }}>{plan.users} user{plan.users > 1 ? "s" : ""}</span>
            </div>
            <div className="font-bold text-[#0f172a] mb-1">{plan.name}</div>
            <div className="text-2xl font-black mb-1" style={{ color: plan.color }}>₹{plan.price}<span className="text-xs font-normal text-[#94a3b8]">/mo</span></div>
            <div className="text-xs text-[#64748b] mt-2">
              Revenue: <span className="font-bold text-[#0f172a]">₹{(plan.price * plan.users).toLocaleString()}/mo</span>
            </div>
            <div className="mt-3 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(plan.users / 6) * 100}%`, background: plan.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Session data from store */}
      <div className="bg-[#0A0A14] rounded-xl p-5 text-white">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-4">Live Session Usage</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Credits Used", val: data.totalCreditsUsed, color: "#F59E0B" },
            { label: "Credits Total", val: data.planCredits, color: "#A78BFA" },
            { label: "Optimizations", val: data.optimizations.length, color: "#10B981" },
            { label: "AI Generations", val: data.aiGenerations.length, color: "#60A5FA" },
          ].map(k => (
            <div key={k.label}>
              <div className="text-xs text-[#64748b]">{k.label}</div>
              <div className="text-2xl font-black mt-1" style={{ color: k.color }}>{k.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
