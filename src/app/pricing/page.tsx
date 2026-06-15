"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Pricing() {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16 md:mb-24">
          <h1 className="t-hero-main text-4xl md:text-6xl">Simple, Transparent Pricing</h1>
          <p className="t-hero-sub text-base md:text-xl">Choose the plan that fits your catalog size. All plans pay for themselves after just 10 optimized orders.</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <motion.div variants={fadeUp} className="bg-white border border-[#e2e8f0] rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-xl transition-shadow">
            <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-2">Free</h3>
            <div className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6">₹0<span className="text-base font-medium text-[#64748b] ml-1">/mo</span></div>
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> 20 Images / Month</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> 5 Research Searches</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Basic Tools</li>
            </ul>
            <button className="btn btn-secondary w-full text-base py-3.5 rounded-xl">Start Free</button>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white border-2 border-[#7C3AED] rounded-3xl p-8 flex flex-col relative shadow-[0_20px_40px_-10px_rgba(124,58,237,0.2)] md:scale-105 z-10 transform transition-transform">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">STARTER</div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-2 mt-2">Starter</h3>
            <div className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6">₹299<span className="text-base font-medium text-[#64748b] ml-1">/mo</span></div>
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> 500 Images / Month</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Unlimited Research</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Basic AI Features</li>
            </ul>
            <button className="btn btn-primary w-full text-base py-3.5 rounded-xl shadow-lg shadow-[#7C3AED]/30">Get Starter</button>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white border border-[#e2e8f0] rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-xl transition-shadow mt-6 md:mt-0">
            <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-2">Pro</h3>
            <div className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6">₹999<span className="text-base font-medium text-[#64748b] ml-1">/mo</span></div>
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Unlimited Images</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Advanced AI Models</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#475569] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Bulk Processing</li>
            </ul>
            <button className="btn btn-secondary w-full text-base py-3.5 rounded-xl hover:bg-[#f8fafc]">Get Pro</button>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-[#0A0A14] border border-[#1a1a2e] rounded-3xl p-8 flex flex-col text-white shadow-2xl relative overflow-hidden mt-6 md:mt-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED] opacity-20 rounded-full blur-[40px]"></div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 relative z-10">Agency</h3>
            <div className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">₹2999<span className="text-base font-medium text-[#94a3b8] ml-1">/mo</span></div>
            <ul className="flex-1 space-y-4 mb-8 relative z-10">
              <li className="flex items-start gap-3 text-sm md:text-base text-[#94a3b8] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Team Access</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#94a3b8] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> API Access</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#94a3b8] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> White Label</li>
              <li className="flex items-start gap-3 text-sm md:text-base text-[#94a3b8] font-medium"><i className="ti ti-check text-[#10B981] text-lg md:text-xl"></i> Advanced Reports</li>
            </ul>
            <button className="btn bg-white text-[#0A0A14] hover:bg-gray-200 w-full text-base py-3.5 rounded-xl relative z-10">Contact Sales</button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
