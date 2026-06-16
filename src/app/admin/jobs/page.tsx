"use client";
import { useAppData, timeAgo } from "../../lib/store";

export default function AdminJobs() {
  const { data } = useAppData();

  const jobs = data.optimizations.map((o, i) => ({
    id: o.id,
    type: "Image Optimization",
    input: o.variantName,
    marketplace: o.marketplace,
    zone: o.zone,
    originalWeight: o.originalWeight,
    optimizedWeight: o.optimizedWeight,
    savings: o.savings,
    status: "completed",
    timestamp: o.timestamp,
  }));

  const aiJobs = data.aiGenerations.map(g => ({
    id: g.id,
    type: g.type === "title" ? "AI Title" : g.type === "description" ? "AI Description" : "AI Keywords",
    input: g.input.slice(0, 40) + (g.input.length > 40 ? "..." : ""),
    marketplace: "—",
    zone: "—",
    originalWeight: null,
    optimizedWeight: null,
    savings: 0,
    status: "completed",
    timestamp: g.timestamp,
  }));

  const allJobs = [...jobs, ...aiJobs].sort((a, b) => b.timestamp - a.timestamp);

  const statusColor = (s: string) =>
    s === "completed" ? "bg-[#D1FAE5] text-[#10B981]" : s === "failed" ? "bg-red-100 text-red-600" : "bg-[#FEF3C7] text-[#D97706]";

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Image Jobs</h1>
        <p className="text-[#475569] mt-1 text-sm">All optimization and AI generation jobs — real-time from your session</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Total Jobs</div>
          <div className="text-3xl font-black text-[#0A0A14]">{allJobs.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Optimizations</div>
          <div className="text-3xl font-black text-[#7C3AED]">{jobs.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">AI Jobs</div>
          <div className="text-3xl font-black text-[#F59E0B]">{aiJobs.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Total Savings</div>
          <div className="text-3xl font-black text-[#10B981]">₹{jobs.reduce((s, j) => s + j.savings, 0)}</div>
        </div>
      </div>

      {allJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#cbd5e1]">
          <i className="ti ti-photo-bolt text-5xl text-[#cbd5e1] mb-4 block"></i>
          <p className="font-semibold text-[#0f172a] text-lg">No jobs yet</p>
          <p className="text-sm text-[#64748b] mt-1">Run the Shipping Optimizer or AI Studio to see jobs here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0f172a]">All Jobs</h3>
            <span className="text-xs bg-[#D1FAE5] text-[#10B981] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Live
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-5 py-3 text-xs font-bold text-[#64748b]">Type</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[#64748b]">Details</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b] hidden sm:table-cell">Marketplace</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b]">Savings</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b]">Status</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-[#64748b] hidden md:table-cell">Time</th>
              </tr></thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {allJobs.map(j => (
                  <tr key={j.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${j.type.startsWith("AI") ? "bg-[#EDE9FE] text-[#7C3AED]" : "bg-[#D1FAE5] text-[#10B981]"}`}>
                        {j.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#0f172a] font-medium">{j.input}</td>
                    <td className="px-5 py-3.5 text-center text-[#64748b] capitalize hidden sm:table-cell">{j.marketplace}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-[#10B981]">{j.savings > 0 ? `₹${j.savings}` : "—"}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(j.status)}`}>{j.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-[#64748b] text-xs hidden md:table-cell">{timeAgo(j.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
