"use client";
import { useState } from "react";

const defaultContent = {
  heroTitle: "AI-Powered Shipping Optimization for Indian Sellers",
  heroSubtitle: "Reduce volumetric weight by 20-40%. Save ₹25-40 per order.",
  heroCTA: "Start Optimizing Free",
  footerTagline: "Helping Indian sellers ship smarter, save more.",
  announcementBar: "",
  announcementActive: false,
  metaTitle: "CatalogIQ — Shipping Optimizer for Meesho, Flipkart, Amazon",
  metaDesc: "AI-driven product image optimization tool that reduces shipping costs for Indian marketplace sellers.",
  blogEnabled: true,
  testimonialCount: 3,
};

export default function AdminCMS() {
  const [content, setContent] = useState(defaultContent);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "seo" | "settings">("hero");

  const set = (key: keyof typeof defaultContent, val: string | boolean | number) =>
    setContent(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Content (CMS)</h1>
          <p className="text-[#475569] mt-1 text-sm">Manage public-facing text, SEO metadata, and site settings</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${saved ? "bg-[#10B981] text-white" : "bg-[#7C3AED] text-white hover:bg-[#5B21B6] shadow-lg shadow-[#7C3AED]/20"}`}
        >
          {saved ? <><i className="ti ti-check"></i> Saved!</> : <><i className="ti ti-device-floppy"></i> Save</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl mb-6 w-fit">
        {(["hero", "seo", "settings"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-[#7C3AED] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"}`}
          >{tab === "seo" ? "SEO" : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>

      {activeTab === "hero" && (
        <div className="space-y-5">
          {/* Announcement Bar */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0f172a] flex items-center gap-2"><i className="ti ti-speakerphone text-[#F59E0B]"></i> Announcement Bar</h3>
              <button
                onClick={() => set("announcementActive", !content.announcementActive)}
                className={`w-11 h-6 rounded-full relative transition-colors ${content.announcementActive ? "bg-[#7C3AED]" : "bg-[#cbd5e1]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.announcementActive ? "translate-x-5" : ""}`}></span>
              </button>
            </div>
            <input
              type="text"
              value={content.announcementBar}
              onChange={e => set("announcementBar", e.target.value)}
              placeholder="🚀 New: Bulk optimization now live! Save more on every order."
              className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none text-sm"
              disabled={!content.announcementActive}
            />
          </div>

          {/* Hero Content */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#0f172a] flex items-center gap-2"><i className="ti ti-home text-[#7C3AED]"></i> Hero Section</h3>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Headline</label>
              <input type="text" value={content.heroTitle} onChange={e => set("heroTitle", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Subtitle</label>
              <textarea rows={2} value={content.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">CTA Button Text</label>
              <input type="text" value={content.heroCTA} onChange={e => set("heroCTA", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Footer Tagline</label>
              <input type="text" value={content.footerTagline} onChange={e => set("footerTagline", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-[#0A0A14] rounded-xl p-5 text-white">
            <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-3">Live Preview</div>
            {content.announcementActive && content.announcementBar && (
              <div className="bg-[#7C3AED] text-white text-xs text-center py-2 px-4 rounded-lg mb-4 font-semibold">{content.announcementBar}</div>
            )}
            <h2 className="text-xl font-black text-white mb-2">{content.heroTitle}</h2>
            <p className="text-sm text-[#94a3b8] mb-4">{content.heroSubtitle}</p>
            <button className="bg-[#7C3AED] text-white text-xs font-bold px-4 py-2 rounded-lg">{content.heroCTA}</button>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2"><i className="ti ti-search text-[#10B981]"></i> SEO Metadata</h3>
          <div>
            <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Page Title Tag</label>
            <input type="text" value={content.metaTitle} onChange={e => set("metaTitle", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
            <div className="text-xs text-[#64748b] mt-1">{content.metaTitle.length}/60 chars</div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Meta Description</label>
            <textarea rows={3} value={content.metaDesc} onChange={e => set("metaDesc", e.target.value)} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm resize-none" />
            <div className={`text-xs mt-1 ${content.metaDesc.length > 160 ? "text-[#EF4444]" : "text-[#64748b]"}`}>{content.metaDesc.length}/160 chars</div>
          </div>
          {/* SERP Preview */}
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
            <div className="text-xs text-[#64748b] mb-2 font-bold">SERP Preview</div>
            <div className="text-lg text-blue-700 font-medium leading-tight">{content.metaTitle}</div>
            <div className="text-xs text-[#10B981]">https://catalogiq.com</div>
            <div className="text-sm text-[#475569] mt-1">{content.metaDesc}</div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2"><i className="ti ti-settings text-[#64748b]"></i> Site Settings</h3>
          <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
            <div>
              <div className="font-semibold text-sm text-[#0f172a]">Blog Section</div>
              <div className="text-xs text-[#64748b]">Show/hide the blog section on public pages</div>
            </div>
            <button onClick={() => set("blogEnabled", !content.blogEnabled)} className={`w-11 h-6 rounded-full relative transition-colors ${content.blogEnabled ? "bg-[#7C3AED]" : "bg-[#cbd5e1]"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.blogEnabled ? "translate-x-5" : ""}`}></span>
            </button>
          </div>
          <div className="py-3">
            <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Testimonials to Show</label>
            <input type="number" min={0} max={10} value={content.testimonialCount} onChange={e => set("testimonialCount", Number(e.target.value))} className="w-full px-3 py-2.5 border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
