"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Contact() {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16 md:mb-24">
          <h1 className="t-hero-main text-4xl md:text-6xl">Get in Touch</h1>
          <p className="t-hero-sub text-base md:text-xl">Have a massive catalog? Need custom API integration? Let's talk.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-16 items-start">
          <motion.div initial="hidden" animate="visible" variants={slideRight} className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#e2e8f0] shadow-sm">
            <div className="mb-10">
              <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6">Direct Contact</h3>
              <div className="flex items-center gap-4 text-[#475569] mb-4 hover:text-[#7C3AED] transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-[#EDE9FE] text-[#7C3AED] rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><i className="ti ti-mail"></i></div>
                <span className="font-medium text-base md:text-lg">support@catalogiq.com</span>
              </div>
              <div className="flex items-center gap-4 text-[#475569] hover:text-[#10B981] transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-[#D1FAE5] text-[#10B981] rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><i className="ti ti-brand-whatsapp"></i></div>
                <span className="font-medium text-base md:text-lg">+91 98765 43210</span>
              </div>
            </div>
            
            <div className="pt-8 border-t border-[#f1f5f9]">
              <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6">HQ Office</h3>
              <div className="flex items-start gap-4 text-[#475569]">
                <div className="w-10 h-10 bg-[#f1f5f9] text-[#64748b] rounded-xl flex items-center justify-center text-xl shrink-0"><i className="ti ti-map-pin"></i></div>
                <p className="text-base md:text-lg leading-relaxed font-medium">
                  123 Tech Park, Sector 4<br/>
                  HSR Layout, Bangalore<br/>
                  Karnataka, India 560102
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={slideLeft} className="bg-white p-8 md:p-12 rounded-[2rem] border border-[#e2e8f0] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED] opacity-5 rounded-full blur-[60px] pointer-events-none"></div>
            <form className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="form-label text-sm md:text-base">First Name</label>
                  <input type="text" className="input-control text-base py-3.5 rounded-xl" placeholder="John" />
                </div>
                <div>
                  <label className="form-label text-sm md:text-base">Last Name</label>
                  <input type="text" className="input-control text-base py-3.5 rounded-xl" placeholder="Doe" />
                </div>
              </div>
              <div className="mb-6">
                <label className="form-label text-sm md:text-base">Work Email</label>
                <input type="email" className="input-control text-base py-3.5 rounded-xl" placeholder="john@company.com" />
              </div>
              <div className="mb-8">
                <label className="form-label text-sm md:text-base">How can we help?</label>
                <textarea className="input-control text-base py-4 rounded-xl min-h-[150px] resize-y" placeholder="Tell us about your catalog size, marketplaces you sell on, and what you need..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full text-lg py-4 rounded-xl shadow-lg shadow-[#7C3AED]/20">Send Message <i className="ti ti-send ml-2"></i></button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
