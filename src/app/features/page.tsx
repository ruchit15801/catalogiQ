"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function Features() {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2e8f0] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EDE9FE] text-[#5B21B6] font-bold text-xs uppercase tracking-wider rounded-full mb-6"><i className="ti ti-sparkles"></i>Platform Overview</span>
            <h1 className="t-hero-main text-4xl md:text-6xl">Everything You Need to <span className="text-gradient">Scale Profitably.</span></h1>
            <p className="t-hero-sub text-base md:text-xl">CatalogIQ is a complete AI-powered operating system for Indian e-commerce sellers. From image optimization that cuts shipping costs by ₹25-40 per order, to SEO content generation and market research — every tool is designed to increase your profit margins on Meesho, Flipkart, Amazon, Shopsy, and JioMart.</p>
          </motion.div>
        </div>
      </section>

      {/* Feature 1: Shipping Optimizer */}
      <section className="py-16 md:py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp}>
              <span className="text-[#7C3AED] font-bold text-xs uppercase tracking-widest bg-[#EDE9FE] px-4 py-1.5 rounded-full mb-5 inline-block">🚀 Flagship Tool</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-5 leading-tight">AI Shipping Image Optimizer</h2>
              <p className="text-base md:text-lg text-[#475569] mb-6 leading-relaxed">Marketplace algorithms calculate shipping using <strong>volumetric weight</strong> — they scan your product image, estimate a bounding box, and assign a weight slab. If your product fills 90% of the frame, the algorithm thinks it&apos;s huge and charges you ₹98-₹120 per order.</p>
              <p className="text-base md:text-lg text-[#475569] mb-6 leading-relaxed">Our AI engine generates <strong>64 image variants</strong> with optimized backgrounds and coverage levels (58-62% sweet spot). Each variant is scored by its shipping impact. The best pick drops your slab from 500g-1kg down to 0-500g — saving ₹25-40 on every single order.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: "ti-photo-scan", label: "64 Variants Per Image", desc: "8 backgrounds × 4 coverages × 2 qualities" },
                  { icon: "ti-coin-rupee", label: "₹25-40 Saved/Order", desc: "Instant slab drop verified on panels" },
                  { icon: "ti-building-store", label: "5 Marketplaces", desc: "Meesho, Flipkart, Amazon, Shopsy, JioMart" },
                  { icon: "ti-map-pin", label: "3 Delivery Zones", desc: "Local, Regional, National rates" },
                ].map(f => (
                  <div key={f.label} className="p-3 bg-white rounded-xl border border-[#e2e8f0] hover:border-[#7C3AED]/30 transition-colors">
                    <i className={`ti ${f.icon} text-[#7C3AED] text-xl mb-1 block`}></i>
                    <div className="text-sm font-bold text-[#0f172a] mb-0.5">{f.label}</div>
                    <div className="text-xs text-[#64748b]">{f.desc}</div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/optimizer" className="btn btn-primary text-base py-3 px-6 rounded-xl">Try Shipping Optimizer <i className="ti ti-arrow-right"></i></Link>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#0A0A14] rounded-2xl p-5 md:p-8 border border-[#1a1a2e] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-transparent"></div>
              <div className="relative z-10 space-y-4">
                <div className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">Live Processing Preview</div>
                <div className="grid grid-cols-3 gap-3">
                  {["#FFD6E0", "#D4F0E5", "#E8D5F5", "#FFF3CD", "#D5E8F0", "#F0E4D5"].map((c, i) => (
                    <div key={i} className="aspect-square rounded-lg flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: c }}>
                      <i className="ti ti-shirt text-3xl" style={{ color: `${c}88`, filter: "brightness(0.6)" }}></i>
                      <div className="absolute bottom-1 right-1 text-[8px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">{55 + i * 3}%</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-[#1a1a2e] p-3 rounded-xl border border-[#2a2a3e]">
                  <div><div className="text-[10px] text-[#64748b]">Best Pick</div><div className="text-sm font-bold text-[#10B981]">Score: 94/100</div></div>
                  <div><div className="text-[10px] text-[#64748b]">Slab</div><div className="text-sm font-bold text-white">0-500g • ₹45</div></div>
                  <div><div className="text-[10px] text-[#64748b]">Savings</div><div className="text-sm font-bold text-[#F59E0B]">₹38/order</div></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: Profit Calculator */}
      <section className="py-16 md:py-24 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp} className="order-2 lg:order-1 bg-white rounded-2xl p-5 md:p-8 border border-[#e2e8f0] shadow-xl">
              <div className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-4">Real-Time Unit Economics</div>
              <div className="space-y-3">
                {[
                  { label: "Revenue", val: "+₹500", color: "#0f172a" },
                  { label: "Sourcing Cost", val: "-₹250", color: "#EF4444" },
                  { label: "Shipping (500g-1kg, National)", val: "-₹118", color: "#EF4444", sub: "₹100+GST" },
                  { label: "Commission (Meesho 0%)", val: "-₹0", color: "#64748b" },
                  { label: "RTO Loss (15% rate)", val: "-₹23", color: "#F59E0B" },
                  { label: "Packaging", val: "-₹10", color: "#64748b" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-[#f1f5f9] last:border-none">
                    <span className="text-sm text-[#475569]">{r.label}</span>
                    <span className="text-sm font-bold" style={{ color: r.color }}>{r.val} {r.sub && <span className="text-[10px] text-[#94a3b8] font-normal">({r.sub})</span>}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#0f172a]">
                  <span className="text-base font-bold text-[#0f172a]">Net Profit</span>
                  <span className="text-xl font-black text-[#10B981]">₹89</span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="order-1 lg:order-2">
              <span className="text-[#10B981] font-bold text-xs uppercase tracking-widest bg-[#D1FAE5] px-4 py-1.5 rounded-full mb-5 inline-block">Unit Economics</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-5 leading-tight">Profit & Margin Calculator</h2>
              <p className="text-base md:text-lg text-[#475569] mb-5 leading-relaxed">Know your exact profit before you list a single product. Our calculator uses <strong>2026-accurate marketplace rate cards</strong> with 18% GST automatically applied to shipping and logistics fees.</p>
              <p className="text-base md:text-lg text-[#475569] mb-5 leading-relaxed">It factors in marketplace commissions (Meesho 0%, Flipkart 5-15%, Amazon 3-12%), RTO return penalties, packaging costs, and gives you instant Margin %, ROI %, and Break-Even point in orders.</p>
              <ul className="space-y-3 mb-6">
                {["Zone-based shipping: Local/Regional/National rates", "18% GST auto-calculated on logistics", "RTO penalty estimation built-in", "CatalogIQ Optimized toggle to compare savings", "Break-even analysis in orders"].map(t => (
                  <li key={t} className="flex items-start gap-2 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-circle-check-filled text-[#10B981] mt-0.5"></i>{t}</li>
                ))}
              </ul>
              <Link href="/dashboard/tools/profit" className="btn btn-primary bg-[#10B981] hover:bg-[#059669] shadow-[#10B981]/30 text-base py-3 px-6 rounded-xl">Open Profit Calculator <i className="ti ti-arrow-right"></i></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature 3: AI Content Studio */}
      <section className="py-16 md:py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp}>
              <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-widest bg-[#FEF3C7] px-4 py-1.5 rounded-full mb-5 inline-block">AI-Powered</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-5 leading-tight">AI Content Studio</h2>
              <p className="text-base md:text-lg text-[#475569] mb-5 leading-relaxed">Stop spending hours writing product titles and descriptions manually. Our AI is trained on <strong>10,000+ top-selling marketplace listings</strong> and generates content optimized specifically for Meesho, Flipkart, and Amazon India search algorithms.</p>
              <p className="text-base md:text-lg text-[#475569] mb-5 leading-relaxed">Every title includes long-tail keywords that rank, every description follows the exact character limits and formatting that each marketplace rewards. Generate titles, descriptions, SEO bullet points, and WhatsApp marketing templates in one click.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: "ti-heading", label: "SEO Titles", desc: "Marketplace-optimized with long-tail keywords" },
                  { icon: "ti-file-description", label: "Descriptions", desc: "1000+ word SEO-rich product descriptions" },
                  { icon: "ti-list", label: "Bullet Points", desc: "Feature highlights that convert browsers to buyers" },
                  { icon: "ti-brand-whatsapp", label: "WhatsApp Ads", desc: "Ready-to-send promotional templates" },
                ].map(f => (
                  <div key={f.label} className="p-3 bg-white rounded-xl border border-[#e2e8f0] hover:border-[#F59E0B]/30 transition-colors">
                    <i className={`ti ${f.icon} text-[#F59E0B] text-xl mb-1 block`}></i>
                    <div className="text-sm font-bold text-[#0f172a] mb-0.5">{f.label}</div>
                    <div className="text-xs text-[#64748b]">{f.desc}</div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/ai-studio" className="btn btn-primary bg-[#F59E0B] hover:bg-[#D97706] shadow-[#F59E0B]/30 text-base py-3 px-6 rounded-xl">Open AI Studio <i className="ti ti-arrow-right"></i></Link>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 md:p-8 border border-[#e2e8f0] shadow-xl">
              <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3">AI Output Preview</div>
              <div className="bg-[#FEF3C7]/30 rounded-xl p-4 border border-[#F59E0B]/20 mb-3">
                <div className="text-[10px] font-bold text-[#F59E0B] mb-1">GENERATED TITLE</div>
                <div className="text-sm font-semibold text-[#0f172a]">Women&apos;s Premium Banarasi Silk Saree with Zari Work — Party Wear Wedding Designer Saree with Unstitched Blouse Piece (Free Size)</div>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] mb-3">
                <div className="text-[10px] font-bold text-[#7C3AED] mb-1">SEO DESCRIPTION (PREVIEW)</div>
                <div className="text-xs text-[#475569] leading-relaxed">Elevate your ethnic wardrobe with this exquisite Banarasi Silk Saree, crafted with intricate golden zari work that adds a touch of royalty to every drape. Perfect for weddings, festivals, and special occasions, this saree features a rich pallu with traditional motifs and a matching unstitched blouse piece...</div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold bg-[#EDE9FE] text-[#7C3AED] px-2 py-1 rounded">Score: 96/100</span>
                <span className="text-[10px] font-bold bg-[#D1FAE5] text-[#10B981] px-2 py-1 rounded">1,247 words</span>
                <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#F59E0B] px-2 py-1 rounded">12 keywords</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature 4: Research Center */}
      <section className="py-16 md:py-24 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-[#0A0A14] font-bold text-xs uppercase tracking-widest bg-[#f1f5f9] px-4 py-1.5 rounded-full mb-5 inline-block">Market Intelligence</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">Research Center & Market Analytics</h2>
            <p className="text-base md:text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">Analyze competitor pricing, identify trending categories, calculate perfect margins before sourcing inventory, and find gaps in the market that your competitors are missing.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "ti-chart-line", title: "Trend Analysis", desc: "Track which product categories are growing 20%+ month-over-month across Meesho and Flipkart. Spot seasonal trends before your competitors.", color: "#7C3AED", bg: "#EDE9FE" },
              { icon: "ti-users", title: "Competitor Research", desc: "Analyze top seller pricing strategies, listing quality scores, and shipping methods. Understand exactly why certain products rank #1.", color: "#10B981", bg: "#D1FAE5" },
              { icon: "ti-calculator", title: "Margin Analysis", desc: "Input your sourcing cost and see projected profit across all 5 marketplaces simultaneously. Know your exact margin before committing.", color: "#F59E0B", bg: "#FEF3C7" },
              { icon: "ti-target", title: "Niche Finder", desc: "AI identifies underserved categories with high demand and low competition. Find products with 40%+ margins that others overlook.", color: "#EF4444", bg: "#FEE2E2" },
            ].map(f => (
              <motion.div key={f.title} variants={fadeUp} className="p-5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] hover:shadow-lg hover:border-[#7C3AED]/20 transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: f.bg, color: f.color }}><i className={`ti ${f.icon} text-2xl`}></i></div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{f.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature 5: Bulk Processing */}
      <section className="py-16 md:py-24 bg-[#0A0A14] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#7C3AED] opacity-15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-[#A78BFA] font-bold text-xs uppercase tracking-widest bg-[#7C3AED]/20 px-4 py-1.5 rounded-full mb-5 inline-block">Coming Soon</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-5">Bulk CSV Processor</h2>
            <p className="text-base md:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed mb-8">Upload 1,000+ products at once via CSV. Our engine optimizes every image in the background and generates a marketplace-ready CSV file with AI-generated titles, descriptions, and optimized images — replacing 2 entire data entry employees.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { val: "1,000+", label: "Products per batch" },
                { val: "< 5 min", label: "Processing time" },
                { val: "Auto-CSV", label: "Ready to upload" },
              ].map(s => (
                <div key={s.label} className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2a2a3e]">
                  <div className="text-2xl font-black text-[#A78BFA] mb-1">{s.val}</div>
                  <div className="text-xs text-[#64748b]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-center px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5">Ready to start saving?</h2>
          <p className="text-lg text-[#EDE9FE] mb-8">Join 12,000+ sellers who are saving thousands on shipping every month.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn bg-white text-[#5B21B6] hover:bg-[#f8fafc] px-8 py-4 text-lg shadow-2xl rounded-xl">Get Started Free</Link>
            <Link href="/pricing" className="btn border-2 border-[#A78BFA] text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl">View Pricing</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
