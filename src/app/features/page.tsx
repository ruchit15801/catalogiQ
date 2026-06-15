"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Features() {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16 md:mb-24">
          <h1 className="t-hero-main text-4xl md:text-6xl">Everything you need to scale.</h1>
          <p className="t-hero-sub text-base md:text-xl">CatalogIQ is more than just an image optimizer. It's a complete operating system for modern e-commerce sellers on Meesho, Flipkart, and Amazon.</p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {/* Section 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} className="order-2 md:order-1">
                  <span className="text-[#7C3AED] font-bold text-xs md:text-sm uppercase tracking-widest bg-[#EDE9FE] px-4 py-1.5 rounded-full mb-6 inline-block">Shipping Optimizer</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6 leading-tight">Never overpay for shipping again.</h2>
                  <p className="text-base md:text-lg text-[#475569] mb-8 leading-relaxed">Our AI analyzes your product images just like marketplace algorithms do. We detect the exact bounding box, and instantly generate variations that force the algorithm to assign you a lower volumetric weight slab.</p>
                  <ul className="space-y-4 mb-10">
                      <li className="flex items-center gap-3 text-base md:text-lg text-[#475569] font-medium"><i className="ti ti-circle-check-filled text-[#10B981] text-xl"></i> Drops volumetric weight by up to 40%</li>
                      <li className="flex items-center gap-3 text-base md:text-lg text-[#475569] font-medium"><i className="ti ti-circle-check-filled text-[#10B981] text-xl"></i> Perfect 58-62% frame coverage logic</li>
                      <li className="flex items-center gap-3 text-base md:text-lg text-[#475569] font-medium"><i className="ti ti-circle-check-filled text-[#10B981] text-xl"></i> Saves ₹20-₹40 per order automatically</li>
                  </ul>
                  <Link href="/dashboard/optimizer" className="btn btn-primary w-full sm:w-auto text-lg py-4 px-8 rounded-xl">Try Optimizer Free</Link>
              </motion.div>
              <motion.div variants={fadeUp} className="order-1 md:order-2 bg-white rounded-[2rem] p-4 md:p-8 border border-[#e2e8f0] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED] opacity-10 rounded-full blur-3xl transition-opacity group-hover:opacity-20"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00f2fe] opacity-10 rounded-full blur-3xl transition-opacity group-hover:opacity-20"></div>
                  <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80" alt="Shipping Savings" className="rounded-2xl shadow-lg border border-[#e2e8f0] relative z-10 w-full object-cover" />
              </motion.div>
          </motion.div>

          {/* Section 2 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} className="bg-[#0A0A14] rounded-[2rem] p-6 md:p-10 border border-[#1a1a2e] shadow-2xl relative overflow-hidden text-white group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                      <div className="bg-[#1a1a2e] p-6 rounded-2xl text-center border border-[#2a2a3e] hover:border-[#7C3AED] transition-colors">
                          <i className="ti ti-robot text-4xl text-[#A78BFA] mb-3 block"></i>
                          <div className="text-sm md:text-base font-bold">Title Generator</div>
                      </div>
                      <div className="bg-[#1a1a2e] p-6 rounded-2xl text-center border border-[#2a2a3e] hover:border-[#7C3AED] transition-colors">
                          <i className="ti ti-list-search text-4xl text-[#A78BFA] mb-3 block"></i>
                          <div className="text-sm md:text-base font-bold">Keyword Magic</div>
                      </div>
                      <div className="bg-[#1a1a2e] p-6 rounded-2xl text-center border border-[#2a2a3e] hover:border-[#10B981] transition-colors">
                          <i className="ti ti-brand-whatsapp text-4xl text-[#10B981] mb-3 block"></i>
                          <div className="text-sm md:text-base font-bold">WhatsApp Ads</div>
                      </div>
                      <div className="bg-[#1a1a2e] p-6 rounded-2xl text-center border border-[#2a2a3e] hover:border-[#A78BFA] transition-colors">
                          <i className="ti ti-file-description text-4xl text-[#A78BFA] mb-3 block"></i>
                          <div className="text-sm md:text-base font-bold">SEO Descriptions</div>
                      </div>
                  </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                  <span className="text-[#7C3AED] font-bold text-xs md:text-sm uppercase tracking-widest bg-[#EDE9FE] px-4 py-1.5 rounded-full mb-6 inline-block">AI Content Studio</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6 leading-tight">Let AI write your entire catalog.</h2>
                  <p className="text-base md:text-lg text-[#475569] mb-8 leading-relaxed">Stop wasting hours writing descriptions and figuring out titles. Our AI generates highly-converting, SEO-optimized content designed specifically to rank #1 on Meesho and Amazon searches.</p>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#7C3AED] font-bold text-lg hover:text-[#5B21B6] transition-colors group">
                    Explore Content Studio <i className="ti ti-arrow-right group-hover:translate-x-2 transition-transform"></i>
                  </Link>
              </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
