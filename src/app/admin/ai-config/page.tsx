"use client";
import { useState } from "react";

const defaultConfig = {
  imageEngine: "sharp",
  maxVariants: 10,
  targetCoverage: 57.5,
  minCoverage: 55,
  maxCoverage: 60,
  canvasSize: 512,
  maxFileSizeKB: 800,
  aiProvider: "openai",
  aiModel: "gpt-4o-mini",
  titlePromptStyle: "seo",
  descWordCount: 150,
  keywordsCount: 15,
  autoAnalyze: true,
  scoreWeightCoverage: 40,
  scoreWeightBgComplexity: 25,
  scoreWeightEdgeConfusion: 15,
  scoreWeightFileSize: 10,
  scoreWeightContrast: 10,
};

export default function AdminAIConfig() {
  const [config, setConfig] = useState(defaultConfig);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof defaultConfig, val: string | number | boolean) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalWeight = config.scoreWeightCoverage + config.scoreWeightBgComplexity + config.scoreWeightEdgeConfusion + config.scoreWeightFileSize + config.scoreWeightContrast;

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">AI Configuration</h1>
          <p className="text-[#475569] mt-1 text-sm">Control the image analysis engine, AI content generation, and scoring weights</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${saved ? "bg-[#10B981] text-white" : "bg-[#7C3AED] text-white hover:bg-[#5B21B6] shadow-lg shadow-[#7C3AED]/20"}`}
        >
          {saved ? <><i className="ti ti-check"></i> Saved!</> : <><i className="ti ti-device-floppy"></i> Save Config</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Image Engine */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <h3 className="font-bold text-[#0f172a] mb-5 flex items-center gap-2"><i className="ti ti-photo-bolt text-[#7C3AED]"></i> Image Engine</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Max Variants", key: "maxVariants", type: "number", min: 1, max: 20 },
              { label: "Canvas Size (px)", key: "canvasSize", type: "number", min: 256, max: 1024 },
              { label: "Target Coverage (%)", key: "targetCoverage", type: "number", min: 50, max: 65 },
              { label: "Min Coverage (%)", key: "minCoverage", type: "number", min: 40, max: 60 },
              { label: "Max Coverage (%)", key: "maxCoverage", type: "number", min: 50, max: 70 },
              { label: "Max File Size (KB)", key: "maxFileSizeKB", type: "number", min: 100, max: 2000 },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  min={(f as any).min} max={(f as any).max}
                  value={config[f.key as keyof typeof config] as number}
                  onChange={e => set(f.key as keyof typeof config, Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <h3 className="font-bold text-[#0f172a] mb-5 flex items-center gap-2"><i className="ti ti-robot text-[#F59E0B]"></i> AI Content Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">AI Provider</label>
              <select value={config.aiProvider} onChange={e => set("aiProvider", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm">
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Model</label>
              <select value={config.aiModel} onChange={e => set("aiModel", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm">
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gemini-flash">Gemini 2.0 Flash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Desc. Word Count</label>
              <input type="number" min={50} max={500} value={config.descWordCount} onChange={e => set("descWordCount", Number(e.target.value))} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Keywords Count</label>
              <input type="number" min={5} max={50} value={config.keywordsCount} onChange={e => set("keywordsCount", Number(e.target.value))} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
            </div>
          </div>
        </div>

        {/* Score Weights */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#0f172a] flex items-center gap-2"><i className="ti ti-chart-bar text-[#10B981]"></i> Score Weights</h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${totalWeight === 100 ? "bg-[#D1FAE5] text-[#10B981]" : "bg-red-100 text-red-600"}`}>
              Total: {totalWeight}% {totalWeight !== 100 ? "(must be 100)" : "✓"}
            </span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Coverage Weight", key: "scoreWeightCoverage", color: "#7C3AED" },
              { label: "BG Complexity Weight", key: "scoreWeightBgComplexity", color: "#F59E0B" },
              { label: "Edge Confusion Weight", key: "scoreWeightEdgeConfusion", color: "#10B981" },
              { label: "File Size Weight", key: "scoreWeightFileSize", color: "#60A5FA" },
              { label: "Contrast Weight", key: "scoreWeightContrast", color: "#F472B6" },
            ].map(f => {
              const val = config[f.key as keyof typeof config] as number;
              return (
                <div key={f.key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-[#0f172a]">{f.label}</span>
                    <span className="font-black" style={{ color: f.color }}>{val}%</span>
                  </div>
                  <input
                    type="range" min={0} max={100}
                    value={val}
                    onChange={e => set(f.key as keyof typeof config, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: f.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
