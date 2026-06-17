"use client";

import { useState, useRef } from "react";
import { useAppData, genId, type Zone, MARKETPLACE_INFO, DEFAULT_PLAN_CONFIG } from "../../lib/store";
import BeforeAfterMotion from "../../components/BeforeAfterMotion";

// ── Meesho categories (complete list) ──────────────────────────────────────
const MEESHO_CATEGORIES = [
  // Women Ethnic
  { value: 'saree', label: 'Saree', group: 'Women Ethnic' },
  { value: 'kurti', label: 'Kurti / Kurta', group: 'Women Ethnic' },
  { value: 'lehenga', label: 'Lehenga Choli', group: 'Women Ethnic' },
  { value: 'salwar_suit', label: 'Salwar Suit / Dupatta', group: 'Women Ethnic' },
  { value: 'anarkali', label: 'Anarkali / Gown', group: 'Women Ethnic' },
  { value: 'dupatta', label: 'Dupatta / Stole', group: 'Women Ethnic' },
  { value: 'blouse', label: 'Saree Blouse', group: 'Women Ethnic' },
  { value: 'sharara', label: 'Sharara / Gharara Set', group: 'Women Ethnic' },
  // Women Western
  { value: 'dress', label: 'Western Dress / Frock', group: 'Women Western' },
  { value: 'top', label: 'Top / T-Shirt (Women)', group: 'Women Western' },
  { value: 'jeans_women', label: 'Jeans / Trousers (Women)', group: 'Women Western' },
  { value: 'jumpsuit', label: 'Jumpsuit / Playsuit', group: 'Women Western' },
  { value: 'coord_set', label: 'Co-ord Set', group: 'Women Western' },
  // Men
  { value: 'shirt', label: 'Men Shirt', group: 'Men' },
  { value: 'tshirt_men', label: 'Men T-Shirt / Polo', group: 'Men' },
  { value: 'jeans_men', label: 'Men Jeans / Trousers', group: 'Men' },
  { value: 'kurta_men', label: 'Men Kurta / Pyjama', group: 'Men' },
  { value: 'jacket_men', label: 'Men Jacket / Blazer', group: 'Men' },
  { value: 'shorts_men', label: 'Men Shorts / Track Pant', group: 'Men' },
  // Kids
  { value: 'kids_clothing', label: 'Kids Clothing (General)', group: 'Kids' },
  { value: 'kids_ethnic', label: 'Kids Ethnic Wear', group: 'Kids' },
  { value: 'kids_western', label: 'Kids Western Wear', group: 'Kids' },
  { value: 'school_uniform', label: 'School Uniform', group: 'Kids' },
  // Home & Kitchen
  { value: 'bedsheet', label: 'Bedsheet / Bedcover', group: 'Home & Kitchen' },
  { value: 'curtain', label: 'Curtain / Door Parda', group: 'Home & Kitchen' },
  { value: 'pillow', label: 'Pillow / Cushion Cover', group: 'Home & Kitchen' },
  { value: 'towel', label: 'Towel / Napkin', group: 'Home & Kitchen' },
  { value: 'kitchen', label: 'Kitchen Utensil / Cookware', group: 'Home & Kitchen' },
  { value: 'storage', label: 'Storage / Organizer Box', group: 'Home & Kitchen' },
  { value: 'pooja', label: 'Pooja / Religious Item', group: 'Home & Kitchen' },
  // Jewellery
  { value: 'jewellery', label: 'Jewellery (General)', group: 'Jewellery' },
  { value: 'necklace', label: 'Necklace / Mala Set', group: 'Jewellery' },
  { value: 'earring', label: 'Earring / Jhumka', group: 'Jewellery' },
  { value: 'bangle', label: 'Bangle / Bracelet', group: 'Jewellery' },
  { value: 'ring', label: 'Ring / Toe Ring', group: 'Jewellery' },
  { value: 'anklet', label: 'Anklet / Payal', group: 'Jewellery' },
  { value: 'hair_accessories', label: 'Hair Clips / Band / Tikka', group: 'Jewellery' },
  // Footwear
  { value: 'footwear', label: 'Footwear (General)', group: 'Footwear' },
  { value: 'heels', label: 'Heels / Block Heels', group: 'Footwear' },
  { value: 'flats', label: 'Flats / Ballerinas', group: 'Footwear' },
  { value: 'sandals', label: 'Sandals / Slippers', group: 'Footwear' },
  { value: 'sneakers', label: 'Sneakers / Sports Shoes', group: 'Footwear' },
  // Electronics & Beauty
  { value: 'electronics', label: 'Electronics / Gadgets', group: 'Electronics & Beauty' },
  { value: 'mobile_cover', label: 'Mobile Cover / Case', group: 'Electronics & Beauty' },
  { value: 'beauty', label: 'Beauty / Skincare Product', group: 'Electronics & Beauty' },
  { value: 'hair_care', label: 'Hair Care Product', group: 'Electronics & Beauty' },
  { value: 'fitness', label: 'Fitness / Health Product', group: 'Electronics & Beauty' },
  { value: 'weighing_scale', label: 'Weighing Scale', group: 'Electronics & Beauty' },
  // Bags & Accessories
  { value: 'bag', label: 'Handbag / Purse', group: 'Bags & Accessories' },
  { value: 'backpack', label: 'Backpack / School Bag', group: 'Bags & Accessories' },
  { value: 'wallet', label: 'Wallet / Clutch', group: 'Bags & Accessories' },
  { value: 'belt', label: 'Belt / Suspender', group: 'Bags & Accessories' },
  { value: 'watch', label: 'Watch / Smart Watch', group: 'Bags & Accessories' },
  // Others
  { value: 'stationery', label: 'Stationery / Office', group: 'Others' },
  { value: 'toys', label: 'Toys / Games', group: 'Others' },
  { value: 'baby', label: 'Baby Product', group: 'Others' },
  { value: 'default', label: 'General / Other', group: 'Others' },
];

interface VariantResult {
  rank: number;
  variantId: string;
  variantName: string;
  styleGroup: 'A' | 'B';
  imageBase64: string;
  coverage: number;
  coverageScore: number;
  bgId: string;
  bgName: string;
  bgType: string;
  bgComplexity: string;
  bgColor: string;
  bgScore: number;
  edgeConfusionScore: number;
  fileSizeScore: number;
  visualContrastScore: number;
  shippingOptScore: number;
  confidence: number;
  fileSizeKB: number;
  quality: number;
  isBestPick: boolean;
  costTier: 'lowest' | 'medium' | 'higher';
  savingsPerOrder: number;
  predictedSlab: string;
  predictedCharge: number;
  shipping: {
    deadWeight: number;
    physicalVolWeight: number;
    imageAdjustedVolWeight: number;
    chargeableWeight: number;
    slab: string;
    rates: { local: number; regional: number; national: number; rto: number };
    selectedZoneRate: number;
    inLowestSlab: boolean;
  };
}

interface OriginalAnalysis {
  coveragePct: number;
  boundingBox: { x: number; y: number; width: number; height: number; aspectRatio: number };
  bgComplexityScore: number;
  edgeStrength: number;
  visualContrastScore: number;
  imageWidth: number;
  imageHeight: number;
}

interface APIResponse {
  success: boolean;
  totalGenerated: number;
  returnCount: number;
  marketplace: string;
  zone: string;
  plan: string;
  originalAnalysis: OriginalAnalysis;
  baseline: { slab: string; rate: number; chargeableWeight: number };
  costRange: { min: number; max: number; mid: number };
  results: VariantResult[];
  error?: string;
}


function VariantCard({ v, isPaid, planConfig, zone, downloadVariant, setPlan, activeCfg }: {
  v: VariantResult;
  isPaid: boolean;
  planConfig: typeof DEFAULT_PLAN_CONFIG;
  zone: string;
  downloadVariant: (b: string, n: string) => void;
  setPlan: (p: 'free' | 'paid') => void;
  activeCfg: typeof DEFAULT_PLAN_CONFIG.paid;
}) {
  const tierColors = {
    lowest: { bg: 'bg-[#10B981]', text: 'text-[#10B981]', border: 'border-[#10B981]/30', light: 'bg-[#D1FAE5]', label: '🟢 Lowest Cost' },
    medium: { bg: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30', light: 'bg-[#FEF3C7]', label: '🟡 Medium Cost' },
    higher: { bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', border: 'border-[#EF4444]/30', light: 'bg-[#FEE2E2]', label: '🔴 Higher Cost' },
  };
  const tc = tierColors[v.costTier ?? 'lowest'];

  return (
    <div className={`bg-white border-2 ${v.isBestPick ? 'border-[#7C3AED]' : 'border-[#e2e8f0]'} rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group relative`}>
      {/* Image */}
      <div className="h-52 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: v.bgColor }}>
        {v.isBestPick && <div className="absolute top-3 left-3 bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-lg font-bold z-10"><i className="ti ti-star-filled mr-1"></i>Best Pick</div>}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${v.styleGroup === 'B' ? 'bg-orange-500/90 text-white' : 'bg-blue-500/90 text-white'}`}>Style {v.styleGroup}</span>
          <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg font-bold">#{v.rank} · {v.shippingOptScore}/100</span>
        </div>
        {v.imageBase64 ? (
          <img src={v.imageBase64} alt={v.variantName} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
        ) : (
          <i className="ti ti-photo text-4xl text-white/50"></i>
        )}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg z-10 font-mono">{v.coverage}% · {v.fileSizeKB}KB</div>
        {/* Shipping cost badge */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 z-10">
          <div className={`flex items-center gap-1 ${tc.bg} text-white text-xs px-2.5 py-1.5 rounded-lg font-black shadow-lg`}>
            <i className="ti ti-truck-delivery"></i> ₹{v.predictedCharge}
          </div>
          {v.savingsPerOrder > 0 && (
            <div className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded font-black">Save ₹{v.savingsPerOrder}</div>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-[#0f172a] text-sm truncate">{v.variantName}</div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tc.light} ${tc.text}`}>{tc.label}</span>
        </div>
        <div className="text-[10px] text-[#64748b] mb-3 capitalize">{v.bgComplexity} · {v.bgType.replace(/_/g,' ')}</div>
        {/* Score bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] font-bold text-[#64748b] mb-1">
            <span>Shipping Opt. Score</span><span className="text-[#7C3AED]">{v.shippingOptScore}/100</span>
          </div>
          <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#10B981] rounded-full" style={{ width: `${v.shippingOptScore}%` }}></div>
          </div>
        </div>
        {/* Score chips */}
        <div className="grid grid-cols-3 gap-1 text-[10px] mb-3">
          <div className="bg-[#EDE9FE] rounded-lg p-1.5 text-center"><div className="text-[#7C3AED] font-black">{v.coverageScore}</div><div className="text-[#5B21B6]">Coverage</div></div>
          <div className="bg-[#FEF3C7] rounded-lg p-1.5 text-center"><div className="text-[#D97706] font-black">{v.bgScore}</div><div className="text-[#92400E]">BG</div></div>
          <div className="bg-[#D1FAE5] rounded-lg p-1.5 text-center"><div className="text-[#10B981] font-black">{v.edgeConfusionScore}</div><div className="text-[#065F46]">Edge</div></div>
        </div>
        {/* Shipping info row */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Slab: </span><span className="font-bold">{v.predictedSlab}</span></div>
          <div className={`p-2 rounded-lg ${tc.light} border ${tc.border}`}><span className="text-[#64748b]">Meesho: </span><span className={`font-black ${tc.text}`}>₹{v.predictedCharge}</span></div>
          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Wt: </span><span className="font-bold">{v.shipping.chargeableWeight}g</span></div>
          <div className={`p-2 rounded-lg ${v.savingsPerOrder > 0 ? 'bg-[#D1FAE5]' : 'bg-[#f8fafc]'}`}>
            <span className="text-[#64748b]">Save: </span>
            <span className={`font-bold ${v.savingsPerOrder > 0 ? 'text-[#10B981]' : ''}`}>₹{v.savingsPerOrder}/order</span>
          </div>
        </div>
        {/* Download */}
        {activeCfg.showDownload ? (
          <button onClick={() => downloadVariant(v.imageBase64, v.variantId)} disabled={!v.imageBase64}
            className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-40">
            <i className="ti ti-download"></i> Download 512×512
          </button>
        ) : (
          <button onClick={() => setPlan('paid')}
            className="w-full bg-[#f8fafc] border border-dashed border-[#7C3AED]/50 hover:bg-[#EDE9FE] text-[#7C3AED] font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
            <i className="ti ti-lock"></i> Unlock — Upgrade to Paid
          </button>
        )}
      </div>
    </div>
  );
}

// ── Searchable category dropdown ────────────────────────────
function CategorySearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const selected = MEESHO_CATEGORIES.find(c => c.value === value);
  const filtered = MEESHO_CATEGORIES.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.group.toLowerCase().includes(search.toLowerCase())
  );
  const groups = Array.from(new Set(filtered.map(c => c.group)));

  return (
    <div className="relative">
      <div
        className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm cursor-pointer flex items-center justify-between bg-white hover:border-[#7C3AED] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className={selected ? 'text-[#0f172a]' : 'text-[#94a3b8]'}>
          {selected ? selected.label : 'Select category...'}
        </span>
        <i className={`ti ti-chevron-${open ? 'up' : 'down'} text-[#64748b]`}></i>
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e2e8f0] rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
              <i className="ti ti-search text-[#94a3b8] text-xs"></i>
              <input
                autoFocus
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-xs flex-1 bg-transparent outline-none text-[#0f172a] placeholder-[#94a3b8]"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {groups.map(group => (
              <div key={group}>
                <div className="px-3 py-1.5 text-[10px] font-black text-[#94a3b8] uppercase tracking-widest bg-[#f8fafc] sticky top-0">{group}</div>
                {filtered.filter(c => c.group === group).map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#EDE9FE] transition-colors ${c.value === value ? 'bg-[#EDE9FE] text-[#7C3AED] font-bold' : 'text-[#0f172a]'}`}
                    onClick={() => { onChange(c.value); setOpen(false); setSearch(''); }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-[#94a3b8]">No category found</div>
            )}
          </div>
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>}
    </div>
  );
}

export default function OptimizerTool() {
  const { addOptimization, data } = useAppData();
  const planConfig = data.planConfig ?? DEFAULT_PLAN_CONFIG;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [apiResult, setApiResult] = useState<APIResponse | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Form
  const [deadWeight, setDeadWeight] = useState(250);
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [marketplace, setMarketplace] = useState("meesho");
  const [zone, setZone] = useState<Zone>("national");
  const [category, setCategory] = useState("default");
  const [plan, setPlan] = useState<'free' | 'paid'>('paid');

  // Dynamic config derived from admin settings
  const isPaid = plan === 'paid';
  const activeCfg = isPaid ? planConfig.paid : planConfig.free;


  const creditsRemaining = data.planCredits - data.totalCreditsUsed;

  // Live preview (simple volumetric — no image adjustments)
  const liveVol = (length * width * height) / 5000 * 1000;
  const liveChargeable = Math.max(deadWeight, liveVol);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setApiResult(null);
      setError("");
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startOptimization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { alert("Upload an image first!"); return; }
    if (creditsRemaining <= 0) { alert("No credits left!"); return; }

    setIsProcessing(true);
    setApiResult(null);
    setError("");
    setLogs([]);
    setProgress(0);

    // Animated progress steps
    const steps = [
      { p: 10, text: "Analyzing bounding box...", log: `Dead: ${deadWeight}g | Vol: ${Math.round(liveVol)}g` },
      { p: 25, text: "Initializing optimization engine...", log: "Engine loaded" },
      { p: 40, text: `Generating variants (8 BGs × 4 coverages × 2 qualities)...`, log: "64 variants queued" },
      { p: 60, text: "Compressing and optimizing files...", log: "Files optimized" },
      { p: 75, text: "Scoring variants by shipping impact...", log: "Score engine running" },
      { p: 90, text: "Selecting top 6 results...", log: "Ranking complete" },
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress(steps[i].p);
      setStepText(steps[i].text);
      setLogs(prev => [...prev, steps[i].log]);
      await new Promise(r => setTimeout(r, 600));
    }

    // Real API call
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("category", category);
      formData.append("deadWeight", String(deadWeight));
      formData.append("L", String(length));
      formData.append("B", String(width));
      formData.append("H", String(height));
      formData.append("marketplace", marketplace);
      formData.append("zone", zone);
      formData.append("plan", plan);

      setStepText("Uploading to server...");
      setProgress(95);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const json: APIResponse = await res.json();

      if (!json.success) {
        setError(json.error || "Processing failed");
        setIsProcessing(false);
        return;
      }

      setProgress(100);
      setStepText("Done!");
      setLogs(prev => [...prev, `✓ ${json.totalGenerated} variants generated`, `✓ Top ${json.results.length} selected`]);
      setApiResult(json);

      // Save best to store
      if (json.results.length > 0) {
        const best = json.results[0];
        addOptimization({
          id: genId(),
          projectName: "Quick Optimization",
          originalWeight: json.baseline.chargeableWeight,
          optimizedWeight: best.shipping.chargeableWeight,
          originalCost: json.baseline.rate,
          optimizedCost: best.shipping.selectedZoneRate,
          savings: best.savingsPerOrder,
          marketplace,
          zone,
          timestamp: Date.now(),
          variantName: best.bgId,
          coverage: `${best.coverage}%`,
        });
      }

      setTimeout(() => setIsProcessing(false), 500);
    } catch (err) {
      setError("Network error — check if server is running");
      setIsProcessing(false);
    }
  };

  const downloadVariant = (base64: string, name: string) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${name}.jpg`;
    link.click();
  };

  return (
    <div className="animate-fade-up max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Shipping Optimizer</h1>
          <p className="text-[#475569] mt-1 text-sm">AI-powered image processing + coverage-based shipping optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-xs font-bold"><i className="ti ti-coins text-[#F59E0B] mr-1"></i>{creditsRemaining} credits</span>
          <span className="bg-[#EDE9FE] text-[#7C3AED] px-3 py-1.5 rounded-lg text-xs font-bold"><i className="ti ti-star-filled mr-1"></i>Flagship Tool</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Sidebar Form */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 md:p-6 shadow-sm">
          <form onSubmit={startOptimization}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Product Image</label>
              <div className={`border-2 border-dashed ${imagePreview ? 'border-[#7C3AED] bg-[#EDE9FE]' : 'border-[#cbd5e1] bg-[#f8fafc] hover:border-[#7C3AED]'} rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden min-h-[140px]`} onClick={() => fileRef.current?.click()}>
                {!imagePreview ? (
                  <><i className="ti ti-photo-plus text-4xl text-[#A78BFA] mb-2 block"></i><div className="text-sm font-semibold text-[#0f172a]">Click or drag image</div><div className="text-xs text-[#64748b] mt-0.5">JPEG, PNG up to 10MB</div></>
                ) : (
                  <><img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-white z-10" /><button type="button" onClick={(ev) => { ev.stopPropagation(); setImageFile(null); setImagePreview(null); setApiResult(null); }} className="absolute top-2 right-2 bg-black/60 text-white border-none w-7 h-7 rounded-full flex items-center justify-center cursor-pointer z-20 hover:bg-black text-sm"><i className="ti ti-x"></i></button></>
                )}
                <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFile} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">Marketplace</label>
                <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]">
                  {Object.entries(MARKETPLACE_INFO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">Zone</label>
                <select value={zone} onChange={(e) => setZone(e.target.value as Zone)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]">
                  <option value="local">Local</option><option value="regional">Regional</option><option value="national">National</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-[#64748b] mb-1">Meesho Category</label>
              <CategorySearch value={category} onChange={setCategory} />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-[#64748b] mb-1">Dead Weight (g)</label>
              <input type="number" value={deadWeight} onChange={(e) => setDeadWeight(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div><label className="block text-xs font-bold text-[#64748b] mb-1">L (cm)</label><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
              <div><label className="block text-xs font-bold text-[#64748b] mb-1">W (cm)</label><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
              <div><label className="block text-xs font-bold text-[#64748b] mb-1">H (cm)</label><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]" min={1} /></div>
            </div>

            {/* LIVE PREVIEW */}
            <div className="bg-[#0A0A14] rounded-xl p-4 mb-5 text-white">
              <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-3">Live Preview</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-[#94a3b8] text-xs">Volumetric Wt.</div><div className="font-bold">{Math.round(liveVol)}g</div></div>
                <div><div className="text-[#94a3b8] text-xs">Chargeable</div><div className="font-bold">{Math.round(liveChargeable)}g</div></div>
              </div>
              <div className="mt-2 text-xs text-[#64748b]">Upload image to see coverage-adjusted results</div>
            </div>

            <button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C3AED]/20 disabled:opacity-50" disabled={isProcessing || !imageFile}>
              {isProcessing ? <><i className="ti ti-loader animate-spin"></i> Processing...</> : <><i className="ti ti-sparkles"></i> Generate Optimized Variants</>}
            </button>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Empty State — How It Works */}
          {!isProcessing && !apiResult && !error && (
            <div className="space-y-6">
              {/* How It Works Steps */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2"><i className="ti ti-bulb text-[#F59E0B]"></i> How It Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { step: 1, icon: "ti-upload", color: "#7C3AED", bg: "#EDE9FE", title: "Upload Image", desc: "Upload your product photo as-is from your camera or studio" },
                    { step: 2, icon: "ti-scan", color: "#F59E0B", bg: "#FEF3C7", title: "AI Analyzes", desc: "Engine generates 64 variants with different backgrounds & coverages" },
                    { step: 3, icon: "ti-chart-bar", color: "#10B981", bg: "#D1FAE5", title: "Score & Rank", desc: "Each variant scored by shipping impact — best pick auto-selected" },
                    { step: 4, icon: "ti-download", color: "#0A0A14", bg: "#f1f5f9", title: "Download & Save", desc: "Download optimized image, upload to marketplace, save ₹25-40/order" },
                  ].map(s => (
                    <div key={s.step} className="relative p-4 rounded-xl border border-[#e2e8f0] hover:shadow-lg hover:border-[#7C3AED]/30 transition-all duration-300 group">
                      <div className="absolute -top-3 -left-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-md" style={{ backgroundColor: s.color }}>{s.step}</div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: s.bg, color: s.color }}><i className={`ti ${s.icon}`}></i></div>
                      <div className="font-bold text-sm text-[#0f172a] mb-1">{s.title}</div>
                      <div className="text-xs text-[#475569] leading-relaxed">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before/After Animation */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0f172a] mb-2 flex items-center gap-2"><i className="ti ti-movie text-[#7C3AED]"></i> Live Demo — Before vs After</h3>
                <p className="text-xs text-[#475569] mb-4">Watch the optimization happen in real-time. Hover to pause.</p>
                <BeforeAfterMotion />
              </div>

              {/* Engine stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-[#EDE9FE] rounded-xl text-center border border-[#7C3AED]/20"><div className="text-2xl font-black text-[#7C3AED] mb-1">8</div><div className="text-xs font-bold text-[#5B21B6]">Backgrounds</div></div>
                <div className="p-4 bg-[#D1FAE5] rounded-xl text-center border border-[#10B981]/20"><div className="text-2xl font-black text-[#10B981] mb-1">4</div><div className="text-xs font-bold text-[#065F46]">Coverages</div></div>
                <div className="p-4 bg-[#FEF3C7] rounded-xl text-center border border-[#F59E0B]/20"><div className="text-2xl font-black text-[#F59E0B] mb-1">2</div><div className="text-xs font-bold text-[#92400E]">Qualities</div></div>
              </div>
              {data.optimizations.length > 0 && (
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] text-sm text-[#475569] text-center">
                  <i className="ti ti-history mr-1"></i>{data.optimizations.length} optimized • ₹{data.optimizations.reduce((s, o) => s + o.savings, 0)} total saved
                </div>
              )}
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="text-center py-16 bg-white border border-[#e2e8f0] shadow-sm rounded-xl min-h-[500px] flex flex-col items-center justify-center animate-fade-up">
              <div className="w-20 h-20 border-4 border-[#EDE9FE] border-t-[#7C3AED] rounded-full animate-spin mb-8"></div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">{stepText}</h3>
              <div className="w-full max-w-md mx-auto mt-6">
                <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#10B981] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-sm font-bold text-[#7C3AED]">{progress}%</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-lg">
                {logs.map((log, i) => <span key={i} className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]">{log}</span>)}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <i className="ti ti-alert-triangle text-4xl text-[#EF4444] mb-4 block"></i>
              <h3 className="text-lg font-bold text-[#991B1B] mb-2">Processing Failed</h3>
              <p className="text-sm text-[#991B1B]">{error}</p>
              <button onClick={() => setError("")} className="mt-4 text-sm font-bold text-[#7C3AED] hover:underline">Try Again</button>
            </div>
          )}

          {/* Results */}
          {!isProcessing && apiResult && apiResult.results.length > 0 && (
            <div className="animate-fade-up space-y-5">

              {/* ── IMPORTANT DISCLAIMER NOTE ─────────────────────── */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#F59E0B]/60 bg-gradient-to-br from-[#FEF3C7] via-[#FFFBEB] to-[#FEF9C3] shadow-lg">
                {/* Accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-[#F59E0B] via-[#EF4444] to-[#F59E0B]"></div>
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center">
                      <i className="ti ti-alert-triangle text-xl text-[#D97706]"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-black text-[#92400E] text-sm uppercase tracking-wide">⚠️ Important — Estimated Shipping Only</span>
                        <span className="bg-[#F59E0B]/20 text-[#92400E] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#F59E0B]/40">READ THIS</span>
                      </div>
                      <p className="text-xs text-[#78350F] leading-relaxed mb-3 font-medium">
                        The shipping rates shown here (₹{apiResult.results[0]?.predictedCharge ?? '—'} etc.) are <strong>algorithmic predictions based on image coverage % and file size</strong> — not Meesho's live server rates. Real charges depend on multiple live factors.
                      </p>
                      {/* Logic explanation grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {[
                          { icon: 'ti-check', color: '#10B981', bg: '#D1FAE5', border: '#10B981/30', title: 'What IS accurate:', points: [
                            'Slab comparison (which slab your product falls in)',
                            'Score ranking (which image variant ships cheaper)',
                            'Savings direction — optimized < baseline is always correct',
                          ]},
                          { icon: 'ti-alert-circle', color: '#EF4444', bg: '#FEE2E2', border: '#EF4444/30', title: 'What may vary in reality:', points: [
                            'Exact ₹ amount — Meesho adjusts rates by season & region',
                            'Volumetric detection — actual Meesho algo is proprietary',
                            'RTO charges — fluctuate based on seller performance score',
                          ]},
                        ].map(s => (
                          <div key={s.title} className={`rounded-xl p-3 border`} style={{ backgroundColor: s.bg, borderColor: s.border.replace('/30','').replace('/','') + '4d' }}>
                            <div className="flex items-center gap-1.5 mb-2">
                              <i className={`ti ${s.icon} text-sm`} style={{ color: s.color }}></i>
                              <span className="text-xs font-black" style={{ color: s.color }}>{s.title}</span>
                            </div>
                            <ul className="space-y-1">
                              {s.points.map((p, i) => (
                                <li key={i} className="text-[11px] text-[#374151] flex items-start gap-1.5">
                                  <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-current inline-block" style={{ color: s.color, backgroundColor: s.color }}></span>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {/* Recommendation */}
                      <div className="flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-3 py-2">
                        <i className="ti ti-bulb text-[#D97706] shrink-0"></i>
                        <p className="text-[11px] text-[#78350F] font-bold">
                          <span className="text-[#D97706]">Best practice:</span> Upload the top-ranked image to Meesho Supplier Panel → go to <em>My Products → Shipping Charges</em> → verify the actual slab assigned. The #1 ranked variant here almost always lands in a lower slab than your original image.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ─────────────────────────────────────────────────── */}

              {/* Original Image Analysis */}
              {apiResult.originalAnalysis && (
                <div className="bg-[#0A0A14] rounded-xl p-5 text-white">
                  <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="ti ti-scan text-[#7C3AED]"></i> Original Image Analysis
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                    {[
                      { label: "Coverage", val: `${apiResult.originalAnalysis.coveragePct}%`, color: "#A78BFA" },
                      { label: "BG Complexity", val: `${apiResult.originalAnalysis.bgComplexityScore}/100`, color: "#F59E0B" },
                      { label: "Edge Strength", val: `${apiResult.originalAnalysis.edgeStrength}/100`, color: "#EF4444" },
                      { label: "Contrast", val: `${apiResult.originalAnalysis.visualContrastScore}/100`, color: "#10B981" },
                      { label: "Width", val: `${apiResult.originalAnalysis.imageWidth}px`, color: "#64748b" },
                      { label: "Height", val: `${apiResult.originalAnalysis.imageHeight}px`, color: "#64748b" },
                    ].map(s => (
                      <div key={s.label} className="bg-white/5 rounded-lg p-2">
                        <div className="text-[10px] text-[#64748b] mb-1">{s.label}</div>
                        <div className="font-black text-sm" style={{ color: s.color }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Generated</div>
                  <div className="text-2xl font-black text-[#0A0A14]">{apiResult.totalGenerated}</div>
                  <div className="text-[10px] text-[#94a3b8] mt-0.5">variants total</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Best Savings</div>
                  <div className="text-2xl font-black text-[#10B981]">₹{apiResult.results[0].savingsPerOrder}/order</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Best Score</div>
                  <div className="text-2xl font-black text-[#7C3AED]">{apiResult.results[0].shippingOptScore}/100</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
                  <div className="text-xs font-bold text-[#64748b] uppercase mb-1">100 Orders/mo</div>
                  <div className="text-2xl font-black text-[#0A0A14]">₹{(apiResult.results[0].savingsPerOrder * 100).toLocaleString()}</div>
                </div>
              </div>

              {/* Baseline vs Best */}
              <div className="bg-[#0A0A14] rounded-xl p-5 text-white grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><div className="text-[10px] uppercase text-[#64748b] font-bold mb-1">Baseline Slab</div><div className="font-bold text-[#EF4444]">{apiResult.baseline.slab} • ₹{apiResult.baseline.rate}</div></div>
                <div><div className="text-[10px] uppercase text-[#64748b] font-bold mb-1">Predicted Slab</div><div className="font-bold text-[#10B981]">{apiResult.results[0].predictedSlab} • ₹{apiResult.results[0].predictedCharge}</div></div>
                <div><div className="text-[10px] uppercase text-[#64748b] font-bold mb-1">Coverage</div><div className="font-bold">{apiResult.results[0].coverage}%</div></div>
                <div><div className="text-[10px] uppercase text-[#64748b] font-bold mb-1">Confidence</div><div className="font-bold text-[#A78BFA]">{apiResult.results[0].confidence}%</div></div>
              </div>

              {/* Plan Toggle */}
              <div className="flex items-center justify-between bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm">
                <div>
                  <div className="font-bold text-[#0f172a] text-sm">Plan Mode</div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    {isPaid ? `Paid — all ${apiResult.results.length} variants, sorted cheapest → highest` : `Free — showing 5 cheapest shipping variants`}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
                  <button onClick={() => setPlan('free')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isPaid ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
                    <i className="ti ti-lock mr-1"></i>Free (5)
                  </button>
                  <button onClick={() => setPlan('paid')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isPaid ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
                    <i className="ti ti-star mr-1"></i>Paid (20)
                  </button>
                </div>
              </div>

              {/* Variants — grouped by cost tier (Lowest → Medium → Higher) */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    {isPaid ? 'All 20 Variants' : 'Top 5 Cheapest Variants'}
                    <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-lg ${isPaid ? 'bg-[#7C3AED] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                      {isPaid ? '★ Paid' : 'Free'}
                    </span>
                  </h2>
                  <span className="text-xs font-semibold text-[#64748b]">{apiResult.totalGenerated} generated</span>
                </div>

                {/* Free upsell */}
                {!isPaid && (
                  <div className="mb-5 p-4 rounded-xl border-2 border-dashed border-[#7C3AED]/40 bg-[#EDE9FE]/30 flex items-center gap-3">
                    <i className="ti ti-lock text-2xl text-[#7C3AED]"></i>
                    <div className="flex-1">
                      <div className="font-bold text-[#5B21B6] text-sm">{planConfig.upsellTitle}</div>
                      <div className="text-xs text-[#7C3AED] mt-0.5">{planConfig.upsellDesc}</div>
                    </div>
                    <button onClick={() => setPlan('paid')} className="shrink-0 bg-[#7C3AED] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#5B21B6] transition-colors">Upgrade ↗</button>
                  </div>
                )}

                {/* Tier sections — paid shows all 3 tiers, free just shows cards */}
                {isPaid ? (
                  ['lowest', 'medium', 'higher'].map(tier => {
                    const tierVariants = apiResult.results.filter(v => v.costTier === tier);
                    if (tierVariants.length === 0) return null;
                    const tierInfo = {
                      lowest: { label: '🟢 Lowest Shipping Cost', desc: 'Best images — drops to cheapest slab', bg: 'bg-[#D1FAE5]', border: 'border-[#10B981]/30', text: 'text-[#065F46]' },
                      medium: { label: '🟡 Medium Shipping Cost', desc: 'Good images — one slab below baseline', bg: 'bg-[#FEF3C7]', border: 'border-[#F59E0B]/30', text: 'text-[#92400E]' },
                      higher: { label: '🔴 Higher Shipping Cost', desc: 'Lower-ranked images — near baseline cost', bg: 'bg-[#FEE2E2]', border: 'border-[#EF4444]/30', text: 'text-[#991B1B]' },
                    }[tier as 'lowest' | 'medium' | 'higher']!;
                    return (
                      <div key={tier} className="mb-8">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 ${tierInfo.bg} ${tierInfo.border}`}>
                          <span className={`font-black text-sm ${tierInfo.text}`}>{tierInfo.label}</span>
                          <span className={`text-xs ${tierInfo.text} opacity-70`}>— {tierInfo.desc}</span>
                          <span className={`ml-auto text-xs font-bold ${tierInfo.text}`}>{tierVariants.length} variants</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {tierVariants.map(v => (
                            <VariantCard key={v.variantId} v={v} isPaid={isPaid} planConfig={planConfig} zone={zone} downloadVariant={downloadVariant} setPlan={setPlan} activeCfg={activeCfg} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {apiResult.results.slice(0, 5).map(v => (
                      <VariantCard key={v.variantId} v={v} isPaid={isPaid} planConfig={planConfig} zone={zone} downloadVariant={downloadVariant} setPlan={setPlan} activeCfg={activeCfg} />
                    ))}
                  </div>
                )}
              </div>

              {/* Zone Rate Table */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm overflow-x-auto">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Zone Rates — Best Variant (₹ per shipment)</h3>
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#64748b]">Zone</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Forward</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">RTO</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Total (RTO@15%)</th>
                  </tr></thead>
                  <tbody>
                    {(["local", "regional", "national"] as const).map((z) => {
                      const r = apiResult.results[0].shipping.rates;
                      const rtoImpact = Math.round(r.rto * 2 * 0.15);
                      return (
                        <tr key={z} className={`border-b border-[#f1f5f9] ${z === zone ? 'bg-[#EDE9FE]/20' : ''}`}>
                          <td className="px-4 py-3 font-semibold capitalize">{z} {z === zone && <span className="text-[10px] text-[#7C3AED] font-bold ml-1">SELECTED</span>}</td>
                          <td className="px-4 py-3 text-center font-bold">₹{r[z]}</td>
                          <td className="px-4 py-3 text-center text-[#64748b]">₹{r.rto}</td>
                          <td className="px-4 py-3 text-center font-bold text-[#EF4444]">₹{r[z] + rtoImpact}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}