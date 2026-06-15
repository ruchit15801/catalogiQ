"use client";

import { useAppData } from "../../lib/store";

export default function Reports() {
  const { data } = useAppData();

  // Compute monthly breakdown from real optimization data
  const monthlyData: Record<string, { images: number; savings: number; weights: number[] }> = {};
  data.optimizations.forEach((opt) => {
    const d = new Date(opt.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { images: 0, savings: 0, weights: [] };
    monthlyData[key].images++;
    monthlyData[key].savings += opt.savings;
    if (opt.originalWeight > 0) {
      monthlyData[key].weights.push(((opt.originalWeight - opt.optimizedWeight) / opt.originalWeight) * 100);
    }
  });

  const months = Object.entries(monthlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, val]) => {
      const [y, m] = key.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        label: `${monthNames[parseInt(m) - 1]} ${y}`,
        images: val.images,
        savings: val.savings,
        avgDrop: val.weights.length > 0 ? Math.round(val.weights.reduce((a, b) => a + b, 0) / val.weights.length) : 0,
      };
    });

  const totalSavings = data.optimizations.reduce((s, o) => s + o.savings, 0);
  const totalImages = data.optimizations.length;
  const avgWeightDrop = totalImages > 0
    ? Math.round(data.optimizations.reduce((s, o) => s + (o.originalWeight > 0 ? ((o.originalWeight - o.optimizedWeight) / o.originalWeight) * 100 : 0), 0) / totalImages)
    : 0;

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Monthly Reports</h1>
        <p className="text-[#475569] mt-1 text-sm">Real-time analytics computed from your actual optimization history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-sm font-semibold text-[#64748b] mb-2">Total Lifetime Savings</div>
          <div className="text-3xl font-bold text-[#10B981]">₹{totalSavings.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-sm font-semibold text-[#64748b] mb-2">Total Images Processed</div>
          <div className="text-3xl font-bold text-[#0A0A14]">{totalImages}</div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="text-sm font-semibold text-[#64748b] mb-2">Average Weight Reduction</div>
          <div className="text-3xl font-bold text-[#7C3AED]">{avgWeightDrop}%</div>
        </div>
      </div>

      {months.length === 0 ? (
        <div className="text-center py-16 text-[#64748b] bg-white rounded-xl border border-dashed border-[#cbd5e1]">
          <i className="ti ti-report-off text-5xl mb-4 block text-[#cbd5e1]"></i>
          <p className="font-medium text-lg text-[#0f172a]">No optimization data yet</p>
          <p className="text-sm mt-1">Run the Shipping Optimizer and your monthly reports will generate automatically</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Month</th>
                <th className="text-center px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Images</th>
                <th className="text-center px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Savings</th>
                <th className="text-center px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase hidden sm:table-cell">Avg. Weight Drop</th>
              </tr></thead>
              <tbody>
                {months.map((m, i) => (
                  <tr key={i} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 md:px-6 py-4 font-semibold text-sm text-[#0f172a]">{m.label}</td>
                    <td className="px-4 md:px-6 py-4 text-center text-sm text-[#475569]">{m.images}</td>
                    <td className="px-4 md:px-6 py-4 text-center text-sm font-bold text-[#10B981]">₹{m.savings.toLocaleString()}</td>
                    <td className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-[#7C3AED] hidden sm:table-cell">{m.avgDrop}%</td>
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
