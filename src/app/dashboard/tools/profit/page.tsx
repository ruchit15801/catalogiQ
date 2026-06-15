"use client";

import { useState } from "react";
import { useAppData, calculateShippingSlab, calcVolumetricWeight, calculateProfit, getAllZoneRates, MARKETPLACE_INFO, type Zone } from "../../../lib/store";

export default function ProfitCalculator() {
  const { data } = useAppData();
  const [sellingPrice, setSellingPrice] = useState(500);
  const [sourcingCost, setSourcingCost] = useState(250);
  const [deadWeight, setDeadWeight] = useState(400);
  const [length, setLength] = useState(25);
  const [width, setWidth] = useState(18);
  const [height, setHeight] = useState(10);
  const [rtoPercentage, setRtoPercentage] = useState(15);
  const [marketplace, setMarketplace] = useState("meesho");
  const [zone, setZone] = useState<Zone>("national");
  const [useOptimized, setUseOptimized] = useState(false);

  const mpInfo = MARKETPLACE_INFO[marketplace];
  const commissionPercent = mpInfo?.commission ?? 0;

  // Real-time volumetric + slab calculation
  const volumetric = calcVolumetricWeight(length, width, height);
  const chargeable = Math.max(deadWeight, volumetric);
  const slab = calculateShippingSlab(chargeable, marketplace, zone);

  // Optimized (40% height reduction via image optimization)
  const optHeight = height * 0.6;
  const optVolumetric = calcVolumetricWeight(length, width, optHeight);
  const optChargeable = Math.max(deadWeight, optVolumetric);
  const optSlab = calculateShippingSlab(optChargeable, marketplace, zone);

  const shippingCost = useOptimized ? optSlab.cost : slab.cost;
  const shippingSaved = useOptimized ? slab.cost - optSlab.cost : 0;

  // Calculate profit using real formula with GST
  const result = calculateProfit({
    sellingPrice,
    sourcingCost,
    shippingCost,
    commissionPercent,
    gstOnShipping: mpInfo?.gst ?? 18,
    rtoPercent: rtoPercentage,
    packagingCost: 8,
  });

  // Zone comparison
  const allZones = getAllZoneRates(chargeable, marketplace);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Profit & Margin Calculator</h1>
        <p className="text-[#475569] mt-1 text-sm">Real-time unit economics with zone-based shipping & GST</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 md:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Selling Price (₹)</label>
              <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-[#cbd5e1] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] text-xl font-bold" min={0} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Sourcing Cost (₹)</label>
              <input type="number" value={sourcingCost} onChange={(e) => setSourcingCost(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-[#cbd5e1] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] text-xl font-bold" min={0} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">Dead Wt. (g)</label><input type="number" value={deadWeight} onChange={(e) => setDeadWeight(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">L (cm)</label><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">W (cm)</label><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">H (cm)</label><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">Marketplace</label>
              <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]">
                {Object.entries(MARKETPLACE_INFO).map(([key, info]) => (<option key={key} value={key}>{info.label}</option>))}
              </select>
            </div>
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">Delivery Zone</label>
              <select value={zone} onChange={(e) => setZone(e.target.value as Zone)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]">
                <option value="local">Local</option><option value="regional">Regional</option><option value="national">National</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-[#64748b] mb-1">RTO Returns (%)</label><input type="number" value={rtoPercentage} onChange={(e) => setRtoPercentage(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={0} max={100} /></div>
          </div>

          {/* Toggle: Use CatalogIQ Optimized Shipping */}
          <div className="flex items-center justify-between p-4 bg-[#EDE9FE]/30 rounded-xl border-2 border-[#7C3AED]/20 mb-6">
            <div>
              <div className="font-bold text-sm text-[#0f172a]"><i className="ti ti-sparkles text-[#7C3AED] mr-1"></i> Use CatalogIQ Optimized Shipping</div>
              <div className="text-xs text-[#475569] mt-0.5">Toggle to see impact of image optimization on profit</div>
            </div>
            <button type="button" onClick={() => setUseOptimized(!useOptimized)} className={`w-12 h-6 rounded-full transition-colors relative ${useOptimized ? 'bg-[#7C3AED]' : 'bg-[#cbd5e1]'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${useOptimized ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          {/* Real-time Formula Breakdown */}
          <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] mb-4">
            <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">Live Formula Breakdown</h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between"><span className="text-[#475569]">Revenue:</span> <span className="text-[#0f172a] font-bold">+₹{sellingPrice}</span></div>
              <div className="flex justify-between"><span className="text-[#475569]">Sourcing:</span> <span className="text-[#EF4444]">−₹{sourcingCost}</span></div>
              <div className="flex justify-between"><span className="text-[#475569]">Shipping ({slab.slab}, {zone}):</span> <span className={useOptimized ? "text-[#10B981]" : "text-[#EF4444]"}>−₹{result.shippingWithGST} <span className="text-[10px] text-[#94a3b8]">(₹{shippingCost}+GST)</span></span></div>
              <div className="flex justify-between"><span className="text-[#475569]">Commission ({commissionPercent}%):</span> <span className="text-[#EF4444]">−₹{Math.round(result.commission)}</span></div>
              <div className="flex justify-between"><span className="text-[#475569]">RTO Penalty ({rtoPercentage}%):</span> <span className="text-[#EF4444]">−₹{Math.round(result.rtoCost)}</span></div>
              <div className="flex justify-between"><span className="text-[#475569]">Packaging:</span> <span className="text-[#EF4444]">−₹{result.packagingCost}</span></div>
            </div>
          </div>

          {/* Zone comparison */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#0A0A14] rounded-xl text-white text-center">
            {(["local", "regional", "national"] as Zone[]).map((z) => (
              <div key={z} className={`p-2.5 rounded-lg ${z === zone ? 'bg-[#7C3AED]/30 ring-1 ring-[#7C3AED]' : 'bg-[#1a1a2e]'}`}>
                <div className="text-[10px] uppercase text-[#94a3b8] font-bold mb-1">{z}</div>
                <div className="font-bold text-sm">₹{allZones[z].cost}</div>
                <div className="text-[10px] text-[#64748b]">{allZones[z].slab}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="bg-[#0A0A14] rounded-xl p-6 shadow-xl text-white sticky top-24 border border-[#1a1a2e]">
          <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-6">Unit Economics</h3>
          <div className="mb-6 pb-6 border-b border-[#2a2a3e]">
            <div className="text-xs text-[#94a3b8] mb-1">Net Profit per Unit</div>
            <div className={`text-5xl font-black ${result.netProfit > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>₹{Math.round(result.netProfit)}</div>
          </div>
          <div className="mb-6 pb-6 border-b border-[#2a2a3e]">
            <div className="text-xs text-[#94a3b8] mb-1">Profit Margin</div>
            <div className={`text-4xl font-black ${result.margin > 20 ? 'text-[#10B981]' : result.margin > 0 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{result.margin.toFixed(1)}%</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#2a2a3e]">
            <div><div className="text-xs text-[#94a3b8] mb-1">ROI</div><div className="text-2xl font-bold text-[#7C3AED]">{result.roi.toFixed(0)}%</div></div>
            <div><div className="text-xs text-[#94a3b8] mb-1">Break Even</div><div className="text-2xl font-bold text-white">{result.breakEven === Infinity ? '∞' : result.breakEven} orders</div></div>
          </div>
          {result.netProfit <= 0 && <div className="bg-red-500/20 text-[#ef4444] p-3 rounded-lg text-sm border border-red-500/30 mb-4"><i className="ti ti-alert-triangle mr-1"></i> Losing money! Optimize shipping or increase price.</div>}
          {useOptimized && shippingSaved > 0 && <div className="bg-[#10B981]/20 text-[#10B981] p-3 rounded-lg text-sm border border-[#10B981]/30"><i className="ti ti-check mr-1"></i> CatalogIQ saves ₹{shippingSaved}/order = ₹{(shippingSaved * 100).toLocaleString()}/100 orders</div>}
        </div>
      </div>
    </div>
  );
}
