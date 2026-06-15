"use client";

import Link from "next/link";
import { useAppData, timeAgo } from "../lib/store";

export default function DashboardHome() {
  const { data } = useAppData();

  // All stats computed in real-time from stored data
  const totalImages = data.optimizations.length;
  const totalSavings = data.optimizations.reduce((sum, o) => sum + o.savings, 0);
  const avgWeightDrop = totalImages > 0
    ? Math.round(data.optimizations.reduce((sum, o) => {
        const drop = o.originalWeight > 0 ? ((o.originalWeight - o.optimizedWeight) / o.originalWeight) * 100 : 0;
        return sum + drop;
      }, 0) / totalImages)
    : 0;
  const creditsRemaining = data.planCredits - data.totalCreditsUsed;
  const recentOptimizations = data.optimizations.slice(0, 5);

  // Monthly savings estimate (last 30 days)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const monthlyOpts = data.optimizations.filter(o => o.timestamp > thirtyDaysAgo);
  const monthlySavings = monthlyOpts.reduce((sum, o) => sum + o.savings, 0);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a]">Welcome back! 👋</h2>
        <p className="text-[#475569] mt-1">Here's your real-time catalog optimization overview.</p>
      </div>

      {/* KPI Cards — all real-time computed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#EDE9FE] text-[#7C3AED] rounded-xl flex items-center justify-center text-2xl"><i className="ti ti-photo"></i></div>
            {totalImages > 0 && <span className="text-xs font-bold text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded-full">Live</span>}
          </div>
          <div className="text-3xl font-bold text-[#0A0A14] mb-1">{totalImages.toLocaleString()}</div>
          <div className="text-sm font-medium text-[#64748b]">Total Images Processed</div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#D1FAE5] text-[#10B981] rounded-xl flex items-center justify-center text-2xl"><i className="ti ti-coin-rupee"></i></div>
          </div>
          <div className="text-3xl font-bold text-[#0A0A14] mb-1">₹{totalSavings.toLocaleString()}</div>
          <div className="text-sm font-medium text-[#64748b]">Total Savings Achieved</div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#FEF3C7] text-[#F59E0B] rounded-xl flex items-center justify-center text-2xl"><i className="ti ti-chart-line"></i></div>
          </div>
          <div className="text-3xl font-bold text-[#0A0A14] mb-1">₹{monthlySavings.toLocaleString()}</div>
          <div className="text-sm font-medium text-[#64748b]">This Month's Savings</div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#f1f5f9] text-[#475569] rounded-xl flex items-center justify-center text-2xl"><i className="ti ti-coins"></i></div>
            <span className="text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] px-2 py-1 rounded-full">Pro Plan</span>
          </div>
          <div className="text-3xl font-bold text-[#0A0A14] mb-1">{creditsRemaining} / {data.planCredits}</div>
          <div className="text-sm font-medium text-[#64748b]">Credits Remaining</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity — real data */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">Recent Optimizations</h3>
          {recentOptimizations.length === 0 ? (
            <div className="text-center py-12 text-[#64748b]">
              <i className="ti ti-photo-off text-4xl mb-3 block"></i>
              <p className="font-medium">No optimizations yet</p>
              <p className="text-sm mt-1">Go to the <Link href="/dashboard/optimizer" className="text-[#7C3AED] font-bold hover:underline">Shipping Optimizer</Link> to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOptimizations.map((opt) => (
                <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0f172a] truncate">{opt.variantName}</div>
                    <div className="text-xs text-[#64748b]">{opt.marketplace} • {timeAgo(opt.timestamp)}</div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono text-[#64748b]">{opt.originalWeight}g → {opt.optimizedWeight}g</span>
                    <span className="text-sm font-bold text-[#10B981] bg-[#D1FAE5] px-2.5 py-1 rounded-full">Save ₹{opt.savings}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/dashboard/optimizer" className="block p-4 rounded-xl border-2 border-[#7C3AED] bg-[#EDE9FE]/30 hover:bg-[#EDE9FE] transition-colors">
              <div className="flex items-center gap-3">
                <i className="ti ti-wand text-xl text-[#7C3AED]"></i>
                <div>
                  <div className="font-bold text-sm text-[#0f172a]">Optimize Image</div>
                  <div className="text-xs text-[#64748b]">Run the shipping optimizer</div>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/ai-studio" className="block p-4 rounded-xl border border-[#e2e8f0] hover:border-[#7C3AED] hover:bg-[#f8fafc] transition-colors">
              <div className="flex items-center gap-3">
                <i className="ti ti-robot text-xl text-[#475569]"></i>
                <div>
                  <div className="font-bold text-sm text-[#0f172a]">Generate Content</div>
                  <div className="text-xs text-[#64748b]">AI titles & descriptions</div>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/tools/profit" className="block p-4 rounded-xl border border-[#e2e8f0] hover:border-[#7C3AED] hover:bg-[#f8fafc] transition-colors">
              <div className="flex items-center gap-3">
                <i className="ti ti-calculator text-xl text-[#475569]"></i>
                <div>
                  <div className="font-bold text-sm text-[#0f172a]">Calculate Profit</div>
                  <div className="text-xs text-[#64748b]">Unit economics calculator</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Real-time stat */}
          {avgWeightDrop > 0 && (
            <div className="mt-6 p-4 bg-[#0A0A14] rounded-xl text-white">
              <div className="text-xs text-[#94a3b8] uppercase tracking-wider font-bold mb-1">Your Avg. Weight Drop</div>
              <div className="text-3xl font-black text-[#10B981]">{avgWeightDrop}%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
