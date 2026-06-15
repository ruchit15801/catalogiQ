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

export default function About() {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <span className="text-[#7C3AED] font-bold text-xs md:text-sm uppercase tracking-widest bg-[#EDE9FE] px-4 py-1.5 rounded-full mb-6 inline-block">Our Mission</span>
          <h1 className="t-hero-main mt-6 mb-8 text-4xl md:text-6xl">Empowering Sellers to Stop Overpaying.</h1>
          <p className="t-body text-base md:text-xl leading-relaxed">CatalogIQ was built by E-commerce veterans who discovered a flaw in marketplace algorithms: the system penalizes sellers for taking standard, high-quality photos. We use AI to beat the algorithm legally.</p>
          <div className="mt-12 md:mt-16 relative rounded-3xl overflow-hidden shadow-2xl border border-[#e2e8f0] group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" className="w-full h-[300px] md:h-[500px] object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt="Team meeting" />
          </div>
        </motion.div>

        <div className="mt-24 md:mt-32">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="t-display text-center mb-12 md:mb-16 text-3xl md:text-5xl">The Technology</motion.h2>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div variants={fadeUp} className="bg-white border border-[#e2e8f0] p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-6 md:mb-8"><i className="ti ti-brain"></i></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">OpenAI & Gemini Integrations</h3>
                  <p className="text-[#475569] text-base md:text-lg leading-relaxed">We use state-of-the-art visual language models to analyze bounding boxes precisely how marketplace parsers do.</p>
              </motion.div>
              
              <motion.div variants={fadeUp} className="bg-white border border-[#e2e8f0] p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-6 md:mb-8"><i className="ti ti-zip"></i></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">Intelligent Compression</h3>
                  <p className="text-[#475569] text-base md:text-lg leading-relaxed">MozJPEG algorithms strip hidden EXIF data and reduce file sizes by 80% without losing visual fidelity—signaling lower weight.</p>
              </motion.div>
              
              <motion.div variants={fadeUp} className="bg-white border border-[#e2e8f0] p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-6 md:mb-8"><i className="ti ti-photo-star"></i></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">Dynamic Backgrounds</h3>
                  <p className="text-[#475569] text-base md:text-lg leading-relaxed">Our generative backgrounds naturally disrupt edge-detection algorithms, forcing them to map smaller bounding boxes.</p>
              </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
