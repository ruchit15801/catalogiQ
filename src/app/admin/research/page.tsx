"use client";
import { useAppData } from "../../lib/store";

export default function AdminResearch() {
  const { data } = useAppData();

  const marketplaceBreakdown: Record<string, { count: number; savings: number }> = {};
  data.optimizations.forEach(o => {
    if (!marketplaceBreakdown[o.marketplace]) marketplaceBreakdown[o.marketplace] = { count: 0, savings: 0 };
    marketplaceBreakdown[o.marketplace].count++;
    marketplaceBreakdown[o.marketplace].savings += o.savings;
  });

  const zoneBreakdown: Record<string, number> = {};
  data.optimizations.forEach(o => {
    zoneBreakdown[o.zone] = (zoneBreakdown[o.zone] || 0) + 1;
  });

  const totalOptimizations = data.optimizations.length;
  const totalSavings = data.optimizations.reduce((s, o) => s + o.savings, 0);
  const avgSavings = totalOptimizations > 0 ? Math.round(totalSavings / totalOptimizations) : 0;

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Research Database</h1>
        <p className="text-[#475569] mt-1 text-sm">Platform-wide optimization insights and marketplace research data</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Records", val: totalOptimizations, color: "text-[#0A0A14]" },
          { label: "Total Savings", val: `₹${totalSavings}`, color: "text-[#10B981]" },
          { label: "Avg Savings/Order", val: `₹${avgSavings}`, color: "text-[#7C3AED]" },
          { label: "AI Generations", val: data.aiGenerations.length, color: "text-[#F59E0B]" },
        ].map(k => (
          <div key={k.label} className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
            <div className="text-xs font-bold text-[#64748b] uppercase mb-2">{k.label}</div>
            <div className={`text-3xl font-black ${k.color}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Marketplace breakdown */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <h3 className="font-bold text-[#0f172a] mb-4">Marketplace Performance</h3>
          {Object.keys(marketplaceBreakdown).length === 0 ? (
            <div className="text-center py-10 text-[#64748b]">
              <i className="ti ti-chart-pie text-4xl text-[#cbd5e1] mb-3 block"></i>
              <p className="text-sm">No marketplace data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(marketplaceBreakdown).map(([mp, d]) => {
                const pct = totalOptimizations > 0 ? Math.round((d.count / totalOptimizations) * 100) : 0;
                return (
                  <div key={mp}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold capitalize text-[#0f172a]">{mp}</span>
                      <span className="text-[#64748b]">{d.count} jobs • ₹{d.savings} saved</span>
                    </div>
                    <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7C3AED] rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Zone breakdown */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <h3 className="font-bold text-[#0f172a] mb-4">Zone Distribution</h3>
          {Object.keys(zoneBreakdown).length === 0 ? (
            <div className="text-center py-10 text-[#64748b]">
              <i className="ti ti-map text-4xl text-[#cbd5e1] mb-3 block"></i>
              <p className="text-sm">No zone data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(zoneBreakdown).map(([zone, count]) => {
                const pct = totalOptimizations > 0 ? Math.round((count / totalOptimizations) * 100) : 0;
                const colors: Record<string, string> = { local: "#10B981", regional: "#F59E0B", national: "#7C3AED" };
                return (
                  <div key={zone}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold capitalize text-[#0f172a]">{zone}</span>
                      <span className="text-[#64748b]">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colors[zone] || "#7C3AED" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Raw data table */}
      {data.optimizations.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e2e8f0]">
            <h3 className="font-bold text-[#0f172a]">Raw Optimization Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-4 py-3 text-xs font-bold text-[#64748b]">Variant</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Marketplace</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Original Wt</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Optimized Wt</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Savings</th>
              </tr></thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {data.optimizations.map(o => (
                  <tr key={o.id} className="hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-medium text-[#0f172a]">{o.variantName}</td>
                    <td className="px-4 py-3 text-center capitalize text-[#64748b]">{o.marketplace}</td>
                    <td className="px-4 py-3 text-center">{o.originalWeight}g</td>
                    <td className="px-4 py-3 text-center text-[#10B981] font-bold">{o.optimizedWeight}g</td>
                    <td className="px-4 py-3 text-center font-black text-[#10B981]">₹{o.savings}</td>
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
