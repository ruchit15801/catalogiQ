"use client";
import { useAppData, timeAgo } from "../../lib/store";

const MOCK_USERS = [
  { id: "u1", name: "Manish Kumar", email: "manish@catalogiq.com", plan: "Pro", status: "active", joined: Date.now() - 86400000 * 12 },
  { id: "u2", name: "Priya Shah", email: "priya.s@gmail.com", plan: "Starter", status: "active", joined: Date.now() - 86400000 * 30 },
  { id: "u3", name: "Rajan Mehta", email: "rajan@meesho.io", plan: "Free", status: "inactive", joined: Date.now() - 86400000 * 60 },
  { id: "u4", name: "Sunita Verma", email: "sunita.v@flipkart.com", plan: "Agency", status: "active", joined: Date.now() - 86400000 * 5 },
  { id: "u5", name: "Arjun Nair", email: "arjun@catalog.in", plan: "Pro", status: "active", joined: Date.now() - 86400000 * 20 },
];

const PLAN_COLORS: Record<string, string> = {
  Free: "bg-[#f1f5f9] text-[#64748b]",
  Starter: "bg-[#FEF3C7] text-[#D97706]",
  Pro: "bg-[#EDE9FE] text-[#7C3AED]",
  Agency: "bg-[#D1FAE5] text-[#10B981]",
};

export default function AdminUsers() {
  const { data } = useAppData();
  const totalOptimizations = data.optimizations.length;
  const totalSavings = data.optimizations.reduce((s, o) => s + o.savings, 0);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">User Management</h1>
        <p className="text-[#475569] mt-1 text-sm">Manage platform users, plans, and activity</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", val: MOCK_USERS.length, color: "text-[#0A0A14]" },
          { label: "Active Users", val: MOCK_USERS.filter(u => u.status === "active").length, color: "text-[#10B981]" },
          { label: "Paid Users", val: MOCK_USERS.filter(u => u.plan !== "Free").length, color: "text-[#7C3AED]" },
          { label: "Platform Optimizations", val: totalOptimizations, color: "text-[#F59E0B]" },
        ].map(k => (
          <div key={k.label} className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
            <div className="text-xs font-bold text-[#64748b] uppercase mb-2">{k.label}</div>
            <div className={`text-3xl font-black ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <h3 className="text-lg font-bold text-[#0f172a]">All Users</h3>
          <span className="text-xs font-semibold text-[#64748b] bg-[#f8fafc] px-3 py-1.5 rounded-lg">
            {MOCK_USERS.length} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th className="text-left px-5 py-3 text-xs font-bold text-[#64748b]">User</th>
              <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b]">Plan</th>
              <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b]">Status</th>
              <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b] hidden sm:table-cell">Joined</th>
              <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b]">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {MOCK_USERS.map(u => (
                <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-sm font-bold shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0f172a]">{u.name}</div>
                        <div className="text-xs text-[#64748b]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PLAN_COLORS[u.plan]}`}>{u.plan}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center justify-center gap-1 w-fit mx-auto ${u.status === 'active' ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#f1f5f9] text-[#94a3b8]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-[#10B981]' : 'bg-[#94a3b8]'}`}></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-[#64748b] hidden sm:table-cell">{timeAgo(u.joined)}</td>
                  <td className="px-5 py-4 text-center">
                    <button className="text-xs font-semibold text-[#7C3AED] hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Savings from Store */}
      <div className="bg-[#0A0A14] rounded-xl p-5 text-white">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-3">Live Platform Metrics</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><div className="text-xs text-[#64748b]">Total Optimizations</div><div className="text-2xl font-black text-[#A78BFA]">{totalOptimizations}</div></div>
          <div><div className="text-xs text-[#64748b]">Total Savings Generated</div><div className="text-2xl font-black text-[#10B981]">₹{totalSavings.toLocaleString()}</div></div>
          <div><div className="text-xs text-[#64748b]">AI Generations</div><div className="text-2xl font-black text-[#F59E0B]">{data.aiGenerations.length}</div></div>
        </div>
      </div>
    </div>
  );
}
