"use client";

import { useState } from "react";
import { useAppData, genId } from "../../lib/store";

export default function AIStudio() {
  const { addAIGeneration, data } = useAppData();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"title" | "description" | "keywords">("title");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const creditsRemaining = data.planCredits - data.totalCreditsUsed;

  const generate = () => {
    if (!prompt.trim()) return;
    if (creditsRemaining <= 0) { alert("No credits remaining!"); return; }
    setIsGenerating(true);
    setOutput("");

    // Real-time AI-style content generation (template engine)
    const p = prompt.trim();
    const words = p.split(" ");
    const titleCase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    const lower = p.toLowerCase();

    const outputs: Record<string, string> = {
      title: [
        `🏆 ${titleCase} - Premium Quality | Free Shipping | COD Available`,
        `⭐ ${titleCase} for Women & Men - Latest Collection 2026`,
        `🔥 Buy ${titleCase} Online at Best Price - Top Rated Seller`,
        `💎 ${titleCase} - Trending Design | 4.5★ Rating | 10K+ Sold`,
        `🎁 ${titleCase} Combo Pack - Extra Discount | Limited Time Offer`,
        `✅ Original ${titleCase} - 100% Genuine | Express Delivery`,
        `🛒 ${titleCase} - New Arrival | Bestseller | Easy Returns`,
        `💰 Affordable ${titleCase} - Under ₹${Math.floor(Math.random() * 500 + 299)} | Best Deal`
      ].join("\n\n"),

      description: `🌟 Premium ${titleCase}\n\nDiscover our hand-curated ${titleCase} collection designed for the modern Indian buyer. Crafted with premium-grade materials, this product combines style with functionality for everyday use.\n\n✅ Product Highlights:\n• Superior quality ${lower} with attention to detail\n• Available in multiple sizes, colors, and patterns\n• Easy wash-and-wear — low maintenance design\n• Lightweight yet durable construction\n• Perfect for daily wear, gifting, and special occasions\n\n📐 Size & Fit:\nPlease refer to the size chart before ordering. Available in S / M / L / XL / XXL. Model is wearing size M.\n\n📦 What's in the Box:\n1x ${titleCase}\n\n🚚 Shipping & Returns:\n• Free delivery on orders above ₹299\n• Easy 7-day returns and exchange policy\n• Cash on Delivery available across India\n\n⭐ Why Choose Us?\nWe are a verified seller with 4.5+ star rating and 10,000+ happy customers. All products are quality-checked before dispatch.\n\n🏷️ Tags: ${lower}, buy ${lower} online, ${lower} for women, ${lower} for men, best ${lower}, trending ${lower} 2026`,

      keywords: [
        lower, `${lower} online`, `buy ${lower}`, `${lower} price`,
        `${lower} for women`, `${lower} for men`, `best ${lower}`,
        `cheap ${lower}`, `${lower} combo`, `${lower} offer`,
        `${lower} india`, `${lower} cod`, `trending ${lower}`,
        `premium ${lower}`, `${lower} under 500`, `${lower} free shipping`,
        `${lower} best price`, `${lower} new arrival`, `${lower} top rated`,
        `${lower} 2026`, `${lower} latest`, `${lower} sale`
      ].join(", ")
    };

    setTimeout(() => {
      const result = outputs[activeTab] || "";
      setOutput(result);
      setIsGenerating(false);
      addAIGeneration({
        id: genId(),
        type: activeTab,
        input: p,
        output: result,
        timestamp: Date.now(),
      });
    }, 1200);
  };

  const recentGenerations = data.aiGenerations.slice(0, 5);

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">AI Content Studio</h1>
          <p className="text-[#475569] mt-1 text-sm">Generate SEO-optimized titles, descriptions, and keywords instantly</p>
        </div>
        <span className="bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-xs font-bold"><i className="ti ti-coins text-[#F59E0B] mr-1"></i>{creditsRemaining} credits left</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="flex flex-wrap gap-2 mb-6 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
            {([["title", "Titles", "ti-heading"], ["description", "Description", "ti-file-text"], ["keywords", "Keywords", "ti-tag"]] as const).map(([key, label, icon]) => (
              <button key={key} onClick={() => { setActiveTab(key); setOutput(""); }} className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-[#7C3AED] text-white shadow-md' : 'text-[#475569] hover:bg-white'}`}>
                <i className={`ti ${icon} mr-1`}></i> {label}
              </button>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Product Name / Description</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input-control min-h-[100px] resize-y" placeholder="e.g., Cotton Banarasi Saree with Zari Work..." />
          </div>
          
          <button onClick={generate} disabled={isGenerating || !prompt.trim()} className="btn btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating ? <><i className="ti ti-loader animate-spin"></i> Generating...</> : <><i className="ti ti-sparkles"></i> Generate with AI (1 credit)</>}
          </button>

          {/* Recent History */}
          {recentGenerations.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
              <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">Recent Generations</h4>
              <div className="space-y-2">
                {recentGenerations.map((gen) => (
                  <button key={gen.id} onClick={() => { setPrompt(gen.input); setActiveTab(gen.type); setOutput(gen.output); }} className="w-full text-left p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#0f172a] truncate">{gen.input}</span>
                      <span className="text-[10px] font-bold uppercase text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded shrink-0 ml-2">{gen.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#0f172a]">Output</h3>
            {output && (
              <button onClick={() => { navigator.clipboard.writeText(output); }} className="text-sm text-[#7C3AED] font-semibold hover:underline flex items-center gap-1"><i className="ti ti-copy"></i> Copy</button>
            )}
          </div>
          {output ? (
            <pre className="flex-1 bg-[#f8fafc] p-4 md:p-5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] whitespace-pre-wrap font-sans leading-relaxed overflow-auto">{output}</pre>
          ) : (
            <div className="flex-1 bg-[#f8fafc] rounded-xl border border-dashed border-[#cbd5e1] flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
              <i className="ti ti-sparkles text-5xl text-[#cbd5e1] mb-4"></i>
              <p className="text-[#64748b]">Enter a product name and click Generate.<br/>AI output will appear here in real-time.</p>
              <p className="text-xs text-[#94a3b8] mt-3">{data.aiGenerations.length} generations done so far</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
