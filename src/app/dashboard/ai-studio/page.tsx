"use client";

import { useState } from "react";
import { useAppData, genId } from "../../lib/store";

export default function AIStudio() {
  const { addAIGeneration, data } = useAppData();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"title" | "description" | "keywords">("title");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [tokenUsage, setTokenUsage] = useState<{ total: number; model: string } | null>(null);

  const creditsRemaining = data.planCredits - data.totalCreditsUsed;

  const generate = async () => {
    if (!prompt.trim()) return;
    if (creditsRemaining <= 0) { alert("No credits remaining!"); return; }
    setIsGenerating(true);
    setOutput("");
    setError("");
    setTokenUsage(null);

    try {
      const res = await fetch("/api/ai-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          prompt: prompt.trim(),
          wordCount: 150,
          keywordsCount: 20,
          model: "gpt-4o-mini",
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Generation failed. Please try again.");
        setIsGenerating(false);
        return;
      }

      const result = json.output || "";
      setOutput(result);
      setTokenUsage({ total: json.usage?.totalTokens || 0, model: json.model || "gpt-4o-mini" });

      addAIGeneration({
        id: genId(),
        type: activeTab,
        input: prompt.trim(),
        output: result,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("AI generation error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const recentGenerations = data.aiGenerations.slice(0, 5);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">AI Content Studio</h1>
          <p className="text-[#475569] mt-1 text-sm">
            Generate SEO-optimized titles, descriptions &amp; keywords using GPT-4o
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#D1FAE5] text-[#065F46] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
            <i className="ti ti-brand-openai" /> OpenAI Live
          </span>
          <span className="bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-xs font-bold">
            <i className="ti ti-coins text-[#F59E0B] mr-1" />{creditsRemaining} credits left
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 mb-6 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
            {(
              [
                ["title", "Titles", "ti-heading"],
                ["description", "Description", "ti-file-text"],
                ["keywords", "Keywords", "ti-tag"],
              ] as const
            ).map(([key, label, icon]) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setOutput(""); setError(""); setTokenUsage(null); }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === key
                    ? "bg-[#7C3AED] text-white shadow-md"
                    : "text-[#475569] hover:bg-white"
                }`}
              >
                <i className={`ti ${icon} mr-1`} /> {label}
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">
              Product Name / Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-control min-h-[100px] resize-y"
              placeholder="e.g., Cotton Banarasi Saree with Zari Work..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
              }}
            />
            <p className="text-xs text-[#94a3b8] mt-1">Press Ctrl+Enter to generate</p>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={isGenerating || !prompt.trim()}
            className="btn btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <i className="ti ti-loader animate-spin" /> Generating with GPT-4o...
              </>
            ) : (
              <>
                <i className="ti ti-brand-openai" /> Generate with OpenAI (1 credit)
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <i className="ti ti-alert-circle text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Recent History */}
          {recentGenerations.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
              <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
                Recent Generations
              </h4>
              <div className="space-y-2">
                {recentGenerations.map((gen) => (
                  <button
                    key={gen.id}
                    onClick={() => {
                      setPrompt(gen.input);
                      setActiveTab(gen.type);
                      setOutput(gen.output);
                      setError("");
                    }}
                    className="w-full text-left p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#0f172a] truncate">
                        {gen.input}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded shrink-0 ml-2">
                        {gen.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a]">Output</h3>
              {tokenUsage && (
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {tokenUsage.model} • {tokenUsage.total} tokens used
                </p>
              )}
            </div>
            {output && (
              <button
                onClick={() => { navigator.clipboard.writeText(output); }}
                className="text-sm text-[#7C3AED] font-semibold hover:underline flex items-center gap-1"
              >
                <i className="ti ti-copy" /> Copy
              </button>
            )}
          </div>

          {isGenerating ? (
            <div className="flex-1 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex flex-col items-center justify-center p-8 min-h-[300px]">
              <div className="w-12 h-12 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin mb-4" />
              <p className="text-[#64748b] font-semibold">Generating with GPT-4o...</p>
              <p className="text-xs text-[#94a3b8] mt-2">Real AI magic in progress ✨</p>
            </div>
          ) : output ? (
            <pre className="flex-1 bg-[#f8fafc] p-4 md:p-5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] whitespace-pre-wrap font-sans leading-relaxed overflow-auto">
              {output}
            </pre>
          ) : (
            <div className="flex-1 bg-[#f8fafc] rounded-xl border border-dashed border-[#cbd5e1] flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
              <i className="ti ti-brand-openai text-5xl text-[#7C3AED] mb-4 opacity-30" />
              <p className="text-[#64748b]">
                Enter a product name and click Generate.
                <br />
                Powered by real OpenAI GPT-4o API.
              </p>
              <p className="text-xs text-[#94a3b8] mt-3">
                {data.aiGenerations.length} generations done so far
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#EDE9FE] to-[#DBEAFE] rounded-xl border border-[#C4B5FD] flex items-start gap-3">
        <i className="ti ti-info-circle text-[#7C3AED] text-lg mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#4C1D95]">Powered by OpenAI GPT-4o Mini</p>
          <p className="text-xs text-[#5B21B6] mt-0.5">
            Real AI-generated content optimized for Indian marketplaces (Meesho, Flipkart, Amazon India).
            Each generation uses 1 credit and calls the live OpenAI API.
          </p>
        </div>
      </div>
    </div>
  );
}
