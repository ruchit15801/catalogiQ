"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ToolsDirectory() {
  const categories = [
    {
      title: "Profit Tools",
      icon: "ti-coin-rupee",
      tools: [
        { name: "Profit & Margin Calculator", link: "/dashboard/tools/profit", highlight: true },
        { name: "Break Even Calculator", link: "#" },
        { name: "ROI Calculator", link: "#" }
      ]
    },
    {
      title: "Listing Tools",
      icon: "ti-list-details",
      tools: [
        { name: "Title Generator (AI)", link: "/dashboard/ai-studio" },
        { name: "Description Generator (AI)", link: "/dashboard/ai-studio" },
        { name: "Keyword Generator", link: "#" }
      ]
    },
    {
      title: "Image Tools",
      icon: "ti-photo",
      tools: [
        { name: "Background Generator", link: "/dashboard/optimizer" },
        { name: "Image Compressor", link: "/dashboard/optimizer" },
        { name: "Bulk CSV Editor", link: "#" }
      ]
    },
    {
      title: "Research Tools",
      icon: "ti-search",
      tools: [
        { name: "Trending Products Finder", link: "/dashboard/research" },
        { name: "Competitor Analyzer", link: "/dashboard/research" },
        { name: "Market Research", link: "/dashboard/research" }
      ]
    }
  ];

  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12 md:mb-16">
          <h1 className="t-hero-main text-4xl md:text-6xl">CatalogIQ Tool Directory</h1>
          <p className="t-hero-sub text-base md:text-xl">The ultimate arsenal for e-commerce sellers. Stop guessing and start scaling with our AI-powered utilities.</p>
        </motion.div>

        {/* FLAGSHIP TOOL HIGHLIGHT */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12 md:mb-20">
          <Link href="/dashboard/optimizer" className="block relative bg-gradient-to-r from-[#0A0A14] to-[#1a1a2e] rounded-[2rem] p-1 lg:p-2 overflow-hidden group hover:shadow-[0_0_50px_rgba(124,58,237,0.3)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#00f2fe] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-[#0A0A14] border border-[#2a2a3e] rounded-[1.5rem] p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 z-10 overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#7C3AED] opacity-20 rounded-full blur-[80px]"></div>
                  
                  <div className="flex-1 text-center lg:text-left relative z-20">
                      <div className="bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-4 sm:mb-6 tracking-widest uppercase">★ Flagship Tool</div>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 lg:mb-6">AI Shipping Image Optimizer</h2>
                      <p className="text-[#94a3b8] text-base sm:text-lg mb-6 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">Our core algorithm. Upload any product image and our AI shrinks the bounding box, reducing your volumetric weight and immediately dropping your marketplace shipping slab by ₹20-₹40 per order.</p>
                      <div className="inline-flex items-center justify-center w-full sm:w-auto gap-3 bg-[#7C3AED] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg group-hover:bg-[#5B21B6] group-hover:scale-105 transition-all">
                          Launch Real-time Engine <i className="ti ti-arrow-right"></i>
                      </div>
                  </div>
                  
                  <div className="flex-none w-full lg:w-96 h-56 sm:h-72 bg-[#1a1a2e] rounded-2xl border border-[#2a2a3e] flex items-center justify-center relative overflow-hidden shadow-2xl mt-8 lg:mt-0">
                      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#7C3AED] to-[#00f2fe]"></div>
                      <i className="ti ti-box text-7xl sm:text-9xl text-[#2a2a3e] absolute animate-pulse"></i>
                      <div className="relative z-10 text-center bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                          <div className="text-4xl sm:text-5xl font-black text-white mb-3">0-500g</div>
                          <div className="text-sm font-bold text-[#10B981] bg-[#10B981]/10 px-4 py-1.5 rounded-full border border-[#10B981]/20">Slab Achieved</div>
                      </div>
                  </div>
              </div>
          </Link>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <motion.div variants={fadeUp} key={i} className="bg-white border border-[#e2e8f0] p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-[#cbd5e1] transition-all">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-xl flex items-center justify-center text-2xl md:text-3xl shadow-sm">
                  <i className={`ti ${cat.icon}`}></i>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">{cat.title}</h2>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {cat.tools.map((tool, j) => (
                  <li key={j}>
                    <Link href={tool.link} className={`flex items-center justify-between group p-3 md:p-4 rounded-xl transition-all ${tool.highlight ? 'bg-[#f8fafc] border border-[#e2e8f0] shadow-sm hover:border-[#7C3AED]' : 'bg-transparent border border-transparent hover:bg-[#f8fafc] hover:border-[#e2e8f0]'}`}>
                      <div className="flex items-center gap-3">
                          {tool.highlight && <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>}
                          <span className={`text-sm md:text-base font-semibold ${tool.highlight ? 'text-[#0f172a]' : 'text-[#475569]'}`}>{tool.name}</span>
                      </div>
                      <i className="ti ti-arrow-right opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#7C3AED] text-lg"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
