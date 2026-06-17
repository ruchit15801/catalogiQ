"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useAppData } from "@/app/lib/store";

interface AdResult {
  id: string;
  name: string;
  type: string;
  imageBase64: string;
  masterPrompt: string;
}

export default function AdGeneratorPage() {
  const { data, useCredit, addAdGeneration } = useAppData();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("Premium Watch");
  
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<AdResult[]>([]);
  const [error, setError] = useState("");
  
  const fileRef = useRef<HTMLInputElement>(null);

  const [isPaid, setIsPaid] = useState(false);
  const userPlan = isPaid ? "paid" : "free";
  const creditsRemaining = data.planCredits - data.totalCreditsUsed;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResults([]);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const runGenerator = async () => {
    if (!file) return;
    if (creditsRemaining <= 0) {
      setError("No credits left! Please upgrade your plan.");
      return;
    }
    setProcessing(true);
    setError("");
    setResults([]);

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("productName", productName);
      fd.append("plan", userPlan);

      const res = await fetch("/api/ad-generator", { method: "POST", body: fd });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Generation failed.");
      } else {
        setResults(json.results);
        useCredit(1); // Deduct 1 credit
        addAdGeneration({ id: String(Date.now()), productName, timestamp: Date.now() });
      }
    } catch (e) {
      setError("Server error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadImg = (base64: string, name: string) => {
    const a = document.createElement("a");
    a.href = base64; 
    a.download = `CatalogIQ_Ad_${name}.jpg`; 
    a.click();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A14]">AI Ads Generator</h1>
        <p className="text-sm text-[#64748b] mt-1">Transform simple product photos into luxury, high-converting commercial advertisements using our premium prompt engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        {/* Sidebar Controls */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5 space-y-5 h-fit sticky top-6">
          <div>
            <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase tracking-wider">Product Image</label>
            <div 
              className={`border-2 border-dashed ${preview ? 'border-[#7C3AED] bg-[#EDE9FE]/20' : 'border-[#cbd5e1] bg-[#f8fafc] hover:border-[#7C3AED]'} rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden min-h-[160px] flex flex-col items-center justify-center`}
              onClick={() => fileRef.current?.click()}
            >
              {!preview ? (
                <>
                  <i className="ti ti-upload text-3xl text-[#A78BFA] mb-2"></i>
                  <div className="text-sm font-bold text-[#0f172a]">Click to Upload</div>
                </>
              ) : (
                <img src={preview} alt="" className="absolute inset-0 w-full h-full object-contain bg-transparent" />
              )}
              <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFile} />
            </div>
            {preview && (
              <button onClick={() => { setFile(null); setPreview(null); }} className="mt-2 text-xs text-[#EF4444] font-bold hover:underline">Remove image</button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase tracking-wider">Product Name / Type</label>
            <input 
              type="text" 
              value={productName} 
              onChange={e => setProductName(e.target.value)} 
              className="w-full px-3 py-2.5 rounded-lg border border-[#cbd5e1] text-sm focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none" 
              placeholder="e.g. Leather Handbag"
            />
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-bold text-[#0f172a]">Your Plan: {isPaid ? 'Premium' : 'Free'}</div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isPaid ? 'bg-[#10B981]' : 'bg-[#cbd5e1]'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPaid ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            <div className="text-xs text-[#64748b]">
              {isPaid 
                ? "You have access to all 5 Premium & Luxury styles." 
                : "You have access to 2 Simple styles. Upgrade for Luxury Ads."}
            </div>
            {!isPaid && (
              <Link href="/dashboard/billing" className="text-xs text-[#7C3AED] font-bold underline mt-2 inline-block">Upgrade Plan →</Link>
            )}
          </div>

          <button 
            onClick={runGenerator} 
            disabled={!file || processing} 
            className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C3AED]/20 disabled:opacity-50 mt-2"
          >
            {processing ? (
              <><i className="ti ti-loader animate-spin text-xl"></i> Generating Ads...</>
            ) : (
              <><i className="ti ti-wand text-xl"></i> Generate Ad Styles</>
            )}
          </button>
          
          {error && <div className="text-sm text-[#EF4444] font-bold text-center mt-2">{error}</div>}
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-up">
              {results.map(res => (
                <div key={res.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                  <div className="aspect-square relative bg-[#f1f5f9] flex items-center justify-center overflow-hidden">
                    <img src={res.imageBase64} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    {res.type === 'premium' && (
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">Premium</div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="text-sm font-black text-[#0A0A14]">{res.name}</div>
                      <div className="text-[11px] text-[#64748b] mt-1 line-clamp-2" title={res.masterPrompt}>
                        GPT-4o Prompt Ready
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => downloadImg(res.imageBase64, res.name.replace(/\s+/g, '_'))} 
                        className="flex-1 bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#0f172a] font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <i className="ti ti-download text-sm"></i> Mockup
                      </button>
                      <button 
                        onClick={() => alert("Master Prompt for GPT-4o Image Edit:\n\n" + res.masterPrompt)} 
                        className="bg-[#EDE9FE] text-[#7C3AED] border border-[#C4B5FD] hover:bg-[#7C3AED] hover:text-white font-semibold px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center"
                        title="View Full Master Prompt"
                      >
                        <i className="ti ti-code text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-[#e2e8f0] rounded-2xl bg-white/50">
              <div className="text-center text-[#94a3b8]">
                <i className="ti ti-ad text-6xl mb-3 opacity-50"></i>
                <p className="font-semibold text-[#64748b]">Upload a product to see ad variations.</p>
                <p className="text-xs mt-1">Generates minimalist backgrounds and premium studio mockups.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
