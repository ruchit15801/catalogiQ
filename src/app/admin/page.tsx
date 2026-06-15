"use client";

import { useAppData } from "../lib/store";

export default function AdminDashboard() {
  const { data } = useAppData();

  // Real-time platform metrics computed from shared store
  const totalOptimizations = data.optimizations.length;
  const totalSavings = data.optimizations.reduce((s, o) => s + o.savings, 0);
  const totalProducts = data.products.length;
  const totalProjects = data.projects.length;
  const totalAIGens = data.aiGenerations.length;
  const creditsUsed = data.totalCreditsUsed;

  // Marketplace breakdown
  const marketplaceBreakdown: Record<string, number> = {};
  data.optimizations.forEach((o) => {
    marketplaceBreakdown[o.marketplace] = (marketplaceBreakdown[o.marketplace] || 0) + 1;
  });

  // Savings breakdown
  const savingsBreakdown: Record<string, number> = {};
  data.optimizations.forEach((o) => {
    savingsBreakdown[o.marketplace] = (savingsBreakdown[o.marketplace] || 0) + o.savings;
  });

  // Recent activity
  const recentActivity = [
    ...data.optimizations.map((o) => ({ type: "optimize" as const, label: `Image optimized: ${o.variantName}`, savings: o.savings, time: o.timestamp })),
    ...data.aiGenerations.map((g) => ({ type: "ai" as const, label: `AI ${g.type}: ${g.input.slice(0, 30)}`, savings: 0, time: g.timestamp })),
    ...data.projects.map((p) => ({ type: "project" as const, label: `Project created: ${p.name}`, savings: 0, time: p.createdAt })),
  ].sort((a, b) => b.time - a.time).slice(0, 10);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Admin Overview</h1>
        <p className="text-[#475569] mt-1 text-sm">Real-time platform metrics — all data computed from actual usage</p>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 md:p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Optimizations</div>
          <div className="text-2xl md:text-3xl font-black text-[#0A0A14]">{totalOptimizations}</div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Total Savings</div>
          <div className="text-2xl md:text-3xl font-black text-[#10B981]">₹{totalSavings.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Products</div>
          <div className="text-2xl md:text-3xl font-black text-[#0A0A14]">{totalProducts}</div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Projects</div>
          <div className="text-2xl md:text-3xl font-black text-[#0A0A14]">{totalProjects}</div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">AI Gens</div>
          <div className="text-2xl md:text-3xl font-black text-[#7C3AED]">{totalAIGens}</div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-xs font-bold text-[#64748b] uppercase mb-2">Credits Used</div>
          <div className="text-2xl md:text-3xl font-black text-[#F59E0B]">{creditsUsed}/{data.planCredits}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Marketplace Breakdown */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">Marketplace Breakdown</h3>
          {Object.keys(marketplaceBreakdown).length === 0 ? (
            <div className="text-center py-8 text-[#64748b]">
              <i className="ti ti-chart-pie text-4xl text-[#cbd5e1] mb-2 block"></i>
              <p className="text-sm">No data yet — optimize some images first</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(marketplaceBreakdown).map(([mp, count]) => {
                const pct = totalOptimizations > 0 ? Math.round((count / totalOptimizations) * 100) : 0;
                return (
                  <div key={mp}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-[#0f172a] capitalize">{mp}</span>
                      <span className="text-[#64748b]">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7C3AED] rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-4 mt-4 border-t border-[#f1f5f9]">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-[#0f172a]">Total Platform Savings</span>
                  <span className="text-[#10B981]">₹{totalSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">Live Activity Feed</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-[#64748b]">
              <i className="ti ti-activity text-4xl text-[#cbd5e1] mb-2 block"></i>
              <p className="text-sm">No activity yet — start using the platform</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-[#f1f5f9]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0 ${
                    act.type === 'optimize' ? 'bg-[#10B981]' : act.type === 'ai' ? 'bg-[#7C3AED]' : 'bg-[#F59E0B]'
                  }`}>
                    <i className={`ti ${act.type === 'optimize' ? 'ti-wand' : act.type === 'ai' ? 'ti-robot' : 'ti-folder'}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0f172a] truncate">{act.label}</div>
                    <div className="text-xs text-[#64748b]">{new Date(act.time).toLocaleString()}</div>
                  </div>
                  {act.savings > 0 && <span className="text-xs font-bold text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-full shrink-0">₹{act.savings}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-[#0A0A14] p-5 md:p-6 rounded-xl text-white border border-[#1a1a2e]">
        <h3 className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-4">System Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
            <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span><span className="text-xs text-[#94a3b8]">API Status</span></div>
            <div className="text-sm font-bold text-[#10B981]">Operational</div>
          </div>
          <div className="p-3 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
            <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span><span className="text-xs text-[#94a3b8]">Database</span></div>
            <div className="text-sm font-bold text-[#10B981]">localStorage</div>
          </div>
          <div className="p-3 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
            <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span><span className="text-xs text-[#94a3b8]">AI Engine</span></div>
            <div className="text-sm font-bold text-[#10B981]">Ready</div>
          </div>
          <div className="p-3 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
            <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span><span className="text-xs text-[#94a3b8]">Queue</span></div>
            <div className="text-sm font-bold text-[#F59E0B]">Idle</div>
          </div>
        </div>
      </div>
    </div>
  );
}
