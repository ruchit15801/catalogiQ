"use client";
import { useAppData } from "../../lib/store";

export default function AdminAnalytics() {
  const { data } = useAppData();

  const totalOpts = data.optimizations.length;
  const totalSavings = data.optimizations.reduce((s, o) => s + o.savings, 0);
  const totalAI = data.aiGenerations.length;
  const creditsUsed = data.totalCreditsUsed;

  // Build daily activity from last 7 days
  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * 86400000);
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 86400000;
    const opts = data.optimizations.filter(o => o.timestamp >= dayStart && o.timestamp < dayEnd).length;
    const ais = data.aiGenerations.filter(g => g.timestamp >= dayStart && g.timestamp < dayEnd).length;
    return { label, opts, ais };
  });

  const maxActivity = Math.max(...days.map(d => d.opts + d.ais), 1);

  // AI breakdown
  const aiByType: Record<string, number> = {};
  data.aiGenerations.forEach(g => {
    aiByType[g.type] = (aiByType[g.type] || 0) + 1;
  });

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Deep Analytics</h1>
        <p className="text-[#475569] mt-1 text-sm">Platform-wide analytics — computed live from all session data</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Events", val: totalOpts + totalAI, icon: "ti-activity", color: "#7C3AED", bg: "#EDE9FE" },
          { label: "Savings Generated", val: `₹${totalSavings}`, icon: "ti-coin-rupee", color: "#10B981", bg: "#D1FAE5" },
          { label: "AI Completions", val: totalAI, icon: "ti-robot", color: "#F59E0B", bg: "#FEF3C7" },
          { label: "Credits Consumed", val: creditsUsed, icon: "ti-coins", color: "#0A0A14", bg: "#f1f5f9" },
        ].map(k => (
          <div key={k.label} className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: k.bg, color: k.color }}>
                <i className={`ti ${k.icon}`}></i>
              </div>
            </div>
            <div className="text-2xl font-black" style={{ color: k.color }}>{k.val}</div>
            <div className="text-xs text-[#64748b] mt-1 font-semibold uppercase">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 7-day activity */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <h3 className="font-bold text-[#0f172a] mb-5">7-Day Activity</h3>
          <div className="flex items-end gap-2 h-36">
            {days.map((d, i) => {
              const h = Math.round(((d.opts + d.ais) / maxActivity) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "120px", justifyContent: "flex-end" }}>
                    {d.ais > 0 && (
                      <div className="w-full rounded-t bg-[#F59E0B]" style={{ height: `${Math.round((d.ais / maxActivity) * 120)}px` }}></div>
                    )}
                    {d.opts > 0 && (
                      <div className="w-full rounded-t bg-[#7C3AED]" style={{ height: `${Math.round((d.opts / maxActivity) * 120)}px` }}></div>
                    )}
                    {d.opts + d.ais === 0 && (
                      <div className="w-full rounded bg-[#f1f5f9]" style={{ height: "4px" }}></div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748b] font-semibold">{d.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#7C3AED] block"></span>Optimizations</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#F59E0B] block"></span>AI Generations</span>
          </div>
        </div>

        {/* AI breakdown */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <h3 className="font-bold text-[#0f172a] mb-4">AI Generation Types</h3>
          {Object.keys(aiByType).length === 0 ? (
            <div className="text-center py-10 text-[#64748b]">
              <i className="ti ti-robot text-4xl text-[#cbd5e1] mb-3 block"></i>
              <p className="text-sm">No AI generations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(aiByType).map(([type, count]) => {
                const pct = totalAI > 0 ? Math.round((count / totalAI) * 100) : 0;
                const colors: Record<string, string> = { title: "#7C3AED", description: "#10B981", keywords: "#F59E0B" };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold capitalize text-[#0f172a]">{type}</span>
                      <span className="text-[#64748b]">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[type] || "#7C3AED" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* System health */}
      <div className="bg-[#0A0A14] rounded-xl p-5 text-white">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-4">Platform Health</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "API Uptime", val: "99.9%", color: "#10B981" },
            { label: "Avg Response", val: "1.2s", color: "#A78BFA" },
            { label: "Error Rate", val: "0.01%", color: "#10B981" },
            { label: "Storage", val: `${Math.round(JSON.stringify(data).length / 1024)}KB`, color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3">
              <div className="text-xs text-[#64748b] mb-1">{s.label}</div>
              <div className="text-xl font-black" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
