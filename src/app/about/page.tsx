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

export default function About() {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2e8f0] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EDE9FE] text-[#5B21B6] font-bold text-xs uppercase tracking-wider rounded-full mb-6"><i className="ti ti-heart-filled"></i>Our Story</span>
            <h1 className="t-hero-main text-4xl md:text-6xl">Built by Sellers, <span className="text-gradient">For Sellers.</span></h1>
            <p className="t-hero-sub text-base md:text-xl">CatalogIQ was born from a simple frustration — we were losing ₹30-40 on every order because marketplace algorithms were overcharging us for shipping based on our product images. We built the technology to fix it, and then made it available to every seller in India.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-5">The Problem We Discovered</h2>
              <p className="text-base text-[#475569] mb-4 leading-relaxed">In early 2025, our founders — experienced Meesho and Flipkart sellers — noticed a pattern. Two identical sarees, same physical weight, same packaging. But one was charged ₹55 for shipping and the other ₹98. The only difference? The product image.</p>
              <p className="text-base text-[#475569] mb-4 leading-relaxed">After months of testing, we cracked the code: marketplace algorithms use <strong>computer vision</strong> to estimate product dimensions from images. A product filling 90% of the frame gets assigned a higher volumetric weight than one filling 60% — even though the actual product is identical.</p>
              <p className="text-base text-[#475569] mb-4 leading-relaxed">This discovery led to CatalogIQ. We built an AI engine that optimizes product images to trick the algorithm into assigning the lowest possible shipping slab — without changing the actual product or violating any marketplace guidelines.</p>
              <div className="bg-[#EDE9FE] p-4 rounded-xl border border-[#7C3AED]/20">
                <div className="text-sm font-bold text-[#5B21B6] mb-1"><i className="ti ti-bulb mr-1"></i>Key Insight</div>
                <div className="text-sm text-[#475569]">Marketplaces don&apos;t weigh your product physically for every order. They estimate shipping weight algorithmically from your product listing images.</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#e2e8f0]">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" className="w-full h-[280px] object-cover" alt="Team discussion" />
                <div className="p-5">
                  <div className="text-sm font-bold text-[#0f172a] mb-2">Founded in Surat, Gujarat</div>
                  <div className="text-sm text-[#475569]">Started by textile sellers who understood the e-commerce logistics problem firsthand. Now serving 12,000+ sellers across India.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: "12,000+", label: "Active Sellers", color: "#7C3AED" },
              { val: "1.2M+", label: "Images Optimized", color: "#10B981" },
              { val: "₹4.8Cr", label: "Total Savings", color: "#F59E0B" },
              { val: "40%", label: "Avg Weight Drop", color: "#0A0A14" },
            ].map(s => (
              <motion.div key={s.label} variants={fadeUp} className="p-4">
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 md:py-24 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mb-3">The Technology Behind CatalogIQ</h2>
            <p className="text-base text-[#475569] max-w-2xl mx-auto">We use enterprise-grade AI and image processing infrastructure to deliver results that actually move the needle on your shipping costs.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "ti-brain", title: "AI Image Engine", desc: "Our server-side image processing generates 64 variants per upload with category-aware coverage targets, 8 marketplace-optimized backgrounds, advanced compression, and metadata cleanup for maximum shipping slab reduction.", color: "#7C3AED", bg: "#EDE9FE" },
              { icon: "ti-chart-bar", title: "Volumetric Weight AI", desc: "Our proprietary scoring algorithm (0-100) weighs slab impact (50%), coverage optimization (25%), file size efficiency (15%), and quality preservation (10%) to rank every variant by shipping cost impact.", color: "#10B981", bg: "#D1FAE5" },
              { icon: "ti-database", title: "Market Rate Engine", desc: "2026-accurate rate cards for 5 major Indian marketplaces across 3 delivery zones. Automatic GST calculation, RTO penalty estimation, and commission-aware profit modeling updated monthly.", color: "#F59E0B", bg: "#FEF3C7" },
            ].map(t => (
              <motion.div key={t.title} variants={fadeUp} className="bg-white p-6 rounded-xl border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: t.bg, color: t.color }}><i className={`ti ${t.icon}`}></i></div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{t.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a] mb-3">What Drives Us</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: "ti-shield-check", title: "100% Legal & Compliant", desc: "We never manipulate physical products or violate marketplace guidelines. Our technology only optimizes image presentation — the same product, photographed smarter." },
              { icon: "ti-rocket", title: "Results That Matter", desc: "Every feature we build must save sellers real money. We track actual panel screenshots and verified slab drops across 12,000+ active users to ensure our engine delivers." },
              { icon: "ti-accessible", title: "Accessible to Every Seller", desc: "From a single-product Meesho seller in a small town to a 10,000-SKU Flipkart agency — our tools work at every scale. Free plan included so anyone can start saving." },
              { icon: "ti-refresh", title: "Always Current", desc: "Marketplace algorithms change. Rate cards update. Our engineering team monitors all 5 marketplaces continuously and updates slab rates, commission structures, and optimization logic monthly." },
            ].map(v => (
              <motion.div key={v.title} variants={fadeUp} className="flex gap-4 p-5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] hover:border-[#7C3AED]/20 transition-colors">
                <div className="w-11 h-11 bg-[#EDE9FE] text-[#7C3AED] rounded-xl flex items-center justify-center text-xl shrink-0"><i className={`ti ${v.icon}`}></i></div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">{v.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-center px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Join 12,000+ sellers saving money every day.</h2>
          <p className="text-lg text-[#EDE9FE] mb-6">Start optimizing your catalog for free — no credit card required.</p>
          <Link href="/signup" className="btn bg-white text-[#5B21B6] hover:bg-[#f8fafc] px-8 py-4 text-lg shadow-2xl rounded-xl">Get Started Free <i className="ti ti-arrow-right ml-1"></i></Link>
        </motion.div>
      </section>
    </div>
  );
}
