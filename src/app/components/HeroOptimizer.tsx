"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface TrialResult {
  totalGenerated: number;
  baseline: { slab: string; rate: number };
  results: {
    rank: number; variantId: string; imageBase64: string; coverage: number;
    bgColor: string; fileSizeKB: number; score: number; savingsPerOrder: number;
    shipping: { slab: string; selectedZoneRate: number; chargeableWeight: number };
    isBestPick: boolean;
  }[];
}

export default function HeroOptimizer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [result, setResult] = useState<TrialResult | null>(null);
  const [error, setError] = useState("");
  const [trialUsed, setTrialUsed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [deadWeight, setDeadWeight] = useState(300);
  const [length, setLength] = useState(28);
  const [width, setWidth] = useState(22);
  const [height, setHeight] = useState(12);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const runFreeTrial = async () => {
    if (!imageFile) return;
    setError("");

    // Check trial availability
    const check = await fetch("/api/free-trial");
    const trial = await check.json();
    if (!trial.canUse) {
      setError(`Free trial used! Resets in ${trial.resetInHours}h. Sign up for unlimited access.`);
      setTrialUsed(true);
      return;
    }

    setProcessing(true);
    setProgress(0);

    const steps = [
      { p: 15, t: "Analyzing image bounding box..." },
      { p: 35, t: "Running Sharp.js engine..." },
      { p: 55, t: "Generating 64 variants..." },
      { p: 75, t: "Scoring by shipping impact..." },
      { p: 90, t: "Selecting best results..." },
    ];
    for (const s of steps) {
      setProgress(s.p);
      setStepText(s.t);
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("deadWeight", String(deadWeight));
      fd.append("L", String(length));
      fd.append("B", String(width));
      fd.append("H", String(height));
      fd.append("marketplace", "meesho");
      fd.append("zone", "national");
      fd.append("category", "default");

      const res = await fetch("/api/generate", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.success) { setError(json.error || "Failed"); setProcessing(false); return; }

      // Record trial usage
      await fetch("/api/free-trial", { method: "POST" });

      setProgress(100);
      setStepText("Done!");
      setResult(json);
      setTrialUsed(true);
      setTimeout(() => setProcessing(false), 400);
    } catch {
      setError("Server error. Please try again.");
      setProcessing(false);
    }
  };

  const downloadImg = (base64: string, name: string) => {
    const a = document.createElement("a");
    a.href = base64; a.download = `${name}.jpg`; a.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 md:mt-20">
      {!result ? (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-[#e2e8f0] shadow-2xl overflow-hidden">
          <div className="h-10 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <span className="ml-3 text-xs font-bold text-[#64748b]">CatalogIQ — Free Trial</span>
          </div>
          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
              {/* Upload */}
              <div>
                <div className={`border-2 border-dashed ${preview ? 'border-[#7C3AED] bg-[#EDE9FE]/20' : 'border-[#cbd5e1] bg-[#f8fafc] hover:border-[#7C3AED]'} rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden min-h-[180px] flex flex-col items-center justify-center`} onClick={() => fileRef.current?.click()}>
                  {!preview ? (
                    <><i className="ti ti-photo-up text-4xl text-[#A78BFA] mb-2"></i><div className="text-sm font-bold text-[#0f172a]">Upload Product Image</div><div className="text-xs text-[#64748b] mt-1">JPEG, PNG — Try it free!</div></>
                  ) : (
                    <img src={preview} alt="" className="absolute inset-0 w-full h-full object-contain bg-white" />
                  )}
                  <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFile} />
                </div>
                {preview && <button onClick={() => { setImageFile(null); setPreview(null); }} className="mt-2 text-xs text-[#EF4444] font-bold hover:underline">Remove image</button>}
              </div>
              {/* Inputs */}
              <div className="space-y-3">
                <div><label className="block text-xs font-bold text-[#64748b] mb-1">Dead Weight (grams)</label><input type="number" value={deadWeight} onChange={e => setDeadWeight(+e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none" min={1} /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="block text-xs font-bold text-[#64748b] mb-1">L (cm)</label><input type="number" value={length} onChange={e => setLength(+e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED] outline-none" min={1} /></div>
                  <div><label className="block text-xs font-bold text-[#64748b] mb-1">W (cm)</label><input type="number" value={width} onChange={e => setWidth(+e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED] outline-none" min={1} /></div>
                  <div><label className="block text-xs font-bold text-[#64748b] mb-1">H (cm)</label><input type="number" value={height} onChange={e => setHeight(+e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED] outline-none" min={1} /></div>
                </div>
                <button onClick={runFreeTrial} disabled={!imageFile || processing} className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C3AED]/20 disabled:opacity-50 mt-2 text-base">
                  {processing ? <><i className="ti ti-loader animate-spin"></i>{stepText}</> : <><i className="ti ti-sparkles"></i>Optimize Free — 1 Trial</>}
                </button>
                {processing && (
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#10B981] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
                )}
                {error && <div className="text-sm text-[#EF4444] font-bold bg-red-50 p-3 rounded-lg border border-red-200"><i className="ti ti-alert-triangle mr-1"></i>{error}{trialUsed && <Link href="/signup" className="ml-2 text-[#7C3AED] underline">Sign Up →</Link>}</div>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS */
        <div className="animate-fade-up space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm text-center"><div className="text-xs font-bold text-[#64748b] uppercase mb-1">Generated</div><div className="text-2xl font-black text-[#0A0A14]">{result.totalGenerated}</div></div>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm text-center"><div className="text-xs font-bold text-[#64748b] uppercase mb-1">Best Score</div><div className="text-2xl font-black text-[#7C3AED]">{result.results[0]?.score}/100</div></div>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm text-center"><div className="text-xs font-bold text-[#64748b] uppercase mb-1">Savings</div><div className="text-2xl font-black text-[#10B981]">₹{result.results[0]?.savingsPerOrder}/order</div></div>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm text-center"><div className="text-xs font-bold text-[#64748b] uppercase mb-1">100 Orders</div><div className="text-2xl font-black text-[#0A0A14]">₹{((result.results[0]?.savingsPerOrder || 0) * 100).toLocaleString()}</div></div>
          </div>
          {/* Top 3 variants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.results.slice(0, 3).map(v => (
              <div key={v.variantId} className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="h-48 relative flex items-center justify-center" style={{ backgroundColor: v.bgColor }}>
                  {v.isBestPick && <div className="absolute top-2 left-2 bg-[#7C3AED] text-white text-[10px] px-2 py-1 rounded-lg font-bold z-10"><i className="ti ti-star-filled mr-0.5"></i>Best</div>}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg font-bold">{v.score}/100</div>
                  {v.imageBase64 && <img src={v.imageBase64} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg font-mono">{v.coverage}% • {v.fileSizeKB}KB</div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between text-xs mb-2"><span className="text-[#64748b]">Slab: {v.shipping.slab}</span><span className="font-bold text-[#10B981]">Save ₹{v.savingsPerOrder}</span></div>
                  <button onClick={() => downloadImg(v.imageBase64, v.variantId)} className="w-full bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#7C3AED] text-[#0f172a] font-semibold py-2 rounded-lg text-xs transition-colors"><i className="ti ti-download mr-1"></i>Download</button>
                </div>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-bold mb-2">Want unlimited optimizations?</h3>
            <p className="text-sm text-[#EDE9FE] mb-4">Sign up free — get 20 images/month on the Free plan</p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-[#5B21B6] font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all text-sm">Get Started Free <i className="ti ti-arrow-right"></i></Link>
          </div>
        </div>
      )}
    </div>
  );
}
