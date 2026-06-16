"use client";

import { useState, useRef } from "react";
import { useAppData, genId, type Zone, MARKETPLACE_INFO } from "../../lib/store";
import BeforeAfterMotion from "../../components/BeforeAfterMotion";

interface VariantResult {
  rank: number;
  variantId: string;
  variantName: string;
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
  results: VariantResult[];
  error?: string;
}

export default function OptimizerTool() {
  const { addOptimization, data } = useAppData();
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
              <label className="block text-xs font-bold text-[#64748b] mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED]">
                <option value="default">General</option><option value="saree">Saree</option><option value="bedsheet">Bedsheet</option>
                <option value="clothing">Clothing</option><option value="jewellery">Jewellery</option><option value="electronics">Electronics</option><option value="footwear">Footwear</option>
              </select>
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

              {/* Variants Grid */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    Top {apiResult.results.length} Ranked Variants
                    <span className="ml-2 text-xs font-normal text-[#64748b]">({apiResult.plan === 'paid' ? 'Paid Plan' : 'Free Plan'})</span>
                  </h2>
                  <span className="text-xs font-semibold text-[#64748b]">{apiResult.totalGenerated} total generated</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {apiResult.results.map((v) => (
                    <div key={v.variantId} className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden hover:shadow-xl hover:border-[#A78BFA] transition-all duration-300 group relative">
                      {/* Image */}
                      <div className="h-52 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: v.bgColor }}>
                        {v.isBestPick && <div className="absolute top-3 left-3 bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-lg font-bold z-10"><i className="ti ti-star-filled mr-1"></i>Best Pick</div>}
                        <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg z-10 font-bold">#{v.rank} • {v.shippingOptScore}/100</div>
                        {v.imageBase64 ? <img src={v.imageBase64} alt={v.variantName} className="w-full h-full object-contain transition-transform group-hover:scale-105" /> : <i className="ti ti-photo text-4xl text-white/50"></i>}
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg z-10 font-mono">{v.coverage}% • {v.fileSizeKB}KB</div>
                        <div className="absolute bottom-3 right-3 bg-[#10B981]/90 text-white text-[10px] px-2 py-1 rounded-lg z-10 font-bold">{v.confidence}% conf.</div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="font-bold text-[#0f172a] mb-1 text-sm">{v.variantName}</div>
                        <div className="text-[10px] text-[#64748b] mb-3 capitalize">{v.bgComplexity} complexity • {v.bgType.replace(/_/g,' ')}</div>

                        {/* Score bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] font-bold text-[#64748b] mb-1">
                            <span>Shipping Opt. Score</span><span className="text-[#7C3AED]">{v.shippingOptScore}/100</span>
                          </div>
                          <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#10B981] rounded-full" style={{ width: `${v.shippingOptScore}%` }}></div>
                          </div>
                        </div>

                        {/* Score breakdown */}
                        <div className="grid grid-cols-3 gap-1 text-[10px] mb-3">
                          <div className="bg-[#EDE9FE] rounded-lg p-1.5 text-center"><div className="text-[#7C3AED] font-black">{v.coverageScore}</div><div className="text-[#5B21B6]">Coverage</div></div>
                          <div className="bg-[#FEF3C7] rounded-lg p-1.5 text-center"><div className="text-[#D97706] font-black">{v.bgScore}</div><div className="text-[#92400E]">BG Score</div></div>
                          <div className="bg-[#D1FAE5] rounded-lg p-1.5 text-center"><div className="text-[#10B981] font-black">{v.edgeConfusionScore}</div><div className="text-[#065F46]">Edge</div></div>
                        </div>

                        {/* Shipping prediction */}
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Predicted Slab: </span><span className="font-bold">{v.predictedSlab}</span></div>
                          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Charge: </span><span className="font-bold">₹{v.predictedCharge}</span></div>
                          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Wt: </span><span className="font-bold">{v.shipping.chargeableWeight}g</span></div>
                          <div className={`p-2 rounded-lg ${v.savingsPerOrder > 0 ? 'bg-[#D1FAE5]' : 'bg-[#f8fafc]'}`}><span className="text-[#64748b]">Save: </span><span className={`font-bold ${v.savingsPerOrder > 0 ? 'text-[#10B981]' : ''}`}>₹{v.savingsPerOrder}</span></div>
                        </div>

                        <button onClick={() => downloadVariant(v.imageBase64, v.variantId)} disabled={!v.imageBase64} className="w-full bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#0f172a] font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-40">
                          <i className="ti ti-download"></i> Download 512×512
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone Rate Table */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm overflow-x-auto">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Zone Rates — Best Variant</h3>
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#64748b]">Zone</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Rate</th>
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

