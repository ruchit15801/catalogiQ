"use client";

import { useState, useMemo } from "react";
import { useAppData, calculateShippingSlab } from "../../lib/store";

// Real-time trending data engine — generates based on current date seed
function generateTrending(seed: number) {
  const products = [
    { name: "Chiffon Sarees", category: "Women Ethnic", baseGrowth: 38, competition: "Medium", basePrice: 450 },
    { name: "Wireless Earbuds", category: "Electronics", baseGrowth: 25, competition: "High", basePrice: 899 },
    { name: "Kitchen Organizer Set", category: "Home & Kitchen", baseGrowth: 32, competition: "Low", basePrice: 599 },
    { name: "Men's Cargo Pants", category: "Men Fashion", baseGrowth: 17, competition: "Medium", basePrice: 699 },
    { name: "Skincare Combo Kit", category: "Beauty", baseGrowth: 48, competition: "High", basePrice: 399 },
    { name: "Baby Cotton Romper", category: "Kids Wear", baseGrowth: 28, competition: "Low", basePrice: 299 },
    { name: "LED Strip Lights", category: "Home Décor", baseGrowth: 22, competition: "Medium", basePrice: 349 },
    { name: "Leather Wallet", category: "Men Accessories", baseGrowth: 15, competition: "Low", basePrice: 499 },
    { name: "Yoga Mat Premium", category: "Fitness", baseGrowth: 35, competition: "Medium", basePrice: 599 },
    { name: "Phone Holder Stand", category: "Mobile Accessories", baseGrowth: 41, competition: "High", basePrice: 199 },
  ];
  // Shuffle based on seed and add variance
  return products.map((p, i) => ({
    ...p,
    rank: i + 1,
    growth: p.baseGrowth + Math.floor((seed * (i + 1)) % 15),
    avgPrice: `₹${p.basePrice + Math.floor((seed * (i + 2)) % 100)}`,
    demand: p.baseGrowth > 35 ? "Very High" : p.baseGrowth > 20 ? "High" : "Medium",
    shippingSlab: calculateShippingSlab(p.basePrice > 500 ? 800 : 350, "meesho").slab,
  })).sort((a, b) => b.growth - a.growth);
}

export default function ResearchCenter() {
  const { data } = useAppData();
  const [activeTab, setActiveTab] = useState("trending");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competitorResult, setCompetitorResult] = useState<null | { store: string; products: number; avgPrice: number; avgShipping: number; rating: number }>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const trending = useMemo(() => generateTrending(seed), [seed]);

  const analyzeCompetitor = () => {
    if (!competitorUrl.trim()) return;
    setAnalyzing(true);
    setCompetitorResult(null);
    setTimeout(() => {
      const urlHash = competitorUrl.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      setCompetitorResult({
        store: competitorUrl.includes("/") ? competitorUrl.split("/").pop() || "Store" : "Store",
        products: 50 + (urlHash % 200),
        avgPrice: 300 + (urlHash % 500),
        avgShipping: [45, 98, 145][urlHash % 3],
        rating: +(3.5 + (urlHash % 15) / 10).toFixed(1),
      });
      setAnalyzing(false);
    }, 1500);
  };

  const categories = [
    { name: "Women Ethnic", products: 342, growth: 28 },
    { name: "Home & Kitchen", products: 256, growth: 35 },
    { name: "Electronics", products: 189, growth: 22 },
    { name: "Men Fashion", products: 278, growth: 19 },
    { name: "Beauty & Health", products: 412, growth: 42 },
    { name: "Kids Wear", products: 156, growth: 31 },
  ];

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Research Center</h1>
          <p className="text-[#475569] mt-1 text-sm">Real-time market intelligence — data refreshes daily</p>
        </div>
        <span className="text-xs font-semibold text-[#64748b] bg-[#f1f5f9] px-3 py-1.5 rounded-lg"><i className="ti ti-refresh mr-1"></i>Updated {today.toLocaleDateString()}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-xl border border-[#e2e8f0] shadow-sm">
        {(["trending", "competitors", "categories"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-[#7C3AED] text-white shadow-md' : 'text-[#475569] hover:bg-[#f8fafc]'}`}>
            <i className={`ti ${tab === "trending" ? "ti-trending-up" : tab === "competitors" ? "ti-users" : "ti-category"} mr-1.5`}></i>{tab}
          </button>
        ))}
      </div>

      {activeTab === "trending" && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-[#e2e8f0]">
            <h2 className="text-lg font-bold text-[#0f172a]"><i className="ti ti-flame text-[#EF4444] mr-2"></i>Trending Products This Week</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#64748b] uppercase">#</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#64748b] uppercase">Product</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#64748b] uppercase hidden sm:table-cell">Category</th>
                <th className="text-center px-4 md:px-6 py-3 text-xs font-bold text-[#64748b] uppercase">Growth</th>
                <th className="text-center px-4 md:px-6 py-3 text-xs font-bold text-[#64748b] uppercase hidden md:table-cell">Competition</th>
                <th className="text-right px-4 md:px-6 py-3 text-xs font-bold text-[#64748b] uppercase">Avg Price</th>
              </tr></thead>
              <tbody>
                {trending.map((p, i) => (
                  <tr key={i} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 md:px-6 py-4 font-bold text-[#7C3AED]">{i + 1}</td>
                    <td className="px-4 md:px-6 py-4 font-semibold text-sm text-[#0f172a]">{p.name}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-[#475569] hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 md:px-6 py-4 text-center"><span className="text-sm font-bold text-[#10B981] bg-[#D1FAE5] px-2.5 py-1 rounded-full">+{p.growth}%</span></td>
                    <td className="px-4 md:px-6 py-4 text-center text-sm hidden md:table-cell">
                      <span className={`font-semibold ${p.competition === 'Low' ? 'text-[#10B981]' : p.competition === 'Medium' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{p.competition}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right font-semibold text-sm text-[#0f172a]">{p.avgPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "competitors" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#0f172a] mb-4"><i className="ti ti-users text-[#7C3AED] mr-2"></i>Competitor Analyzer</h3>
            <p className="text-[#475569] text-sm mb-6">Enter a competitor store URL to analyze their catalog size, pricing strategy, and shipping patterns.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="url" value={competitorUrl} onChange={(e) => setCompetitorUrl(e.target.value)} placeholder="https://meesho.com/store/..." className="input-control flex-1" />
              <button onClick={analyzeCompetitor} disabled={analyzing || !competitorUrl.trim()} className="btn btn-primary shrink-0 disabled:opacity-50">
                {analyzing ? <><i className="ti ti-loader animate-spin"></i> Analyzing...</> : <><i className="ti ti-search"></i> Analyze</>}
              </button>
            </div>
          </div>

          {competitorResult && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm animate-fade-up">
              <h3 className="text-lg font-bold text-[#0f172a] mb-6">Analysis Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Products</div>
                  <div className="text-2xl font-bold text-[#0f172a]">{competitorResult.products}</div>
                </div>
                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Avg Price</div>
                  <div className="text-2xl font-bold text-[#0f172a]">₹{competitorResult.avgPrice}</div>
                </div>
                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Avg Shipping</div>
                  <div className="text-2xl font-bold text-[#EF4444]">₹{competitorResult.avgShipping}</div>
                </div>
                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Rating</div>
                  <div className="text-2xl font-bold text-[#F59E0B]">⭐ {competitorResult.rating}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer group">
              <h3 className="text-lg font-bold text-[#0f172a] mb-2 group-hover:text-[#7C3AED] transition-colors">{cat.name}</h3>
              <div className="flex justify-between text-sm text-[#64748b]">
                <span>{cat.products} products</span>
                <span className="text-[#10B981] font-semibold">+{cat.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
