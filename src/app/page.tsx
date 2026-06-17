"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import HeroOptimizer from "./components/HeroOptimizer";
import BeforeAfterMotion from "./components/BeforeAfterMotion";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const [calcWeight, setCalcWeight] = useState(600);
  const [calcItems, setCalcItems] = useState(100);

  const currentSlabCost = calcWeight > 500 ? 98 : 45;
  const optimizedSlabCost = 45;
  const savingsPerItem = currentSlabCost - optimizedSlabCost;
  const totalMonthlySavings = savingsPerItem * calcItems;

  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-[#e2e8f0]">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#7C3AED] opacity-10 rounded-full blur-[100px] animate-pulse-glow -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#00f2fe] opacity-10 rounded-full blur-[100px] animate-pulse-glow delay-500 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial="hidden" animate="visible" variants={fadeUpVariant}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] shadow-sm text-[#5B21B6] font-semibold text-xs md:text-sm rounded-full mb-6 md:mb-8">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> 
                CatalogIQ Version 2.0 — Optimization Engine Live
              </span>
              <h1 className="t-hero-main text-4xl sm:text-5xl md:text-7xl">Stop overpaying for shipping.<br/>Start <span className="text-gradient">Optimizing Your Images.</span></h1>
              <p className="t-hero-sub text-base sm:text-lg md:text-xl px-4">Marketplace algorithms penalize you for high-quality photos. Upload your product image below — our AI engine generates 64 optimized variants instantly, finds the one that drops your shipping cost to the lowest slab.</p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} transition={{ delay: 0.3 }}>
              <HeroOptimizer />
            </motion.div>
        </div>
      </section>

      {/* 2. LIVE METRICS COUNTER */}
      <section className="bg-white border-b border-[#e2e8f0] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center md:divide-x divide-[#e2e8f0]">
                <motion.div variants={fadeUpVariant} className="px-2 md:px-4">
                    <div className="text-3xl md:text-5xl font-black text-[#0A0A14] mb-2 tracking-tight">1.2M+</div>
                    <div className="text-xs md:text-sm font-semibold text-[#64748b] uppercase tracking-wider">Images Optimized</div>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="px-2 md:px-4">
                    <div className="text-3xl md:text-5xl font-black text-[#0A0A14] mb-2 tracking-tight">₹4.8Cr</div>
                    <div className="text-xs md:text-sm font-semibold text-[#64748b] uppercase tracking-wider">Seller Savings</div>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="px-2 md:px-4 mt-6 md:mt-0">
                    <div className="text-3xl md:text-5xl font-black text-[#0A0A14] mb-2 tracking-tight">40%</div>
                    <div className="text-xs md:text-sm font-semibold text-[#64748b] uppercase tracking-wider">Avg. Weight Drop</div>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="px-2 md:px-4 mt-6 md:mt-0">
                    <div className="text-3xl md:text-5xl font-black text-[#0A0A14] mb-2 tracking-tight">12k+</div>
                    <div className="text-xs md:text-sm font-semibold text-[#64748b] uppercase tracking-wider">Active Sellers</div>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-20 md:py-32 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16 md:mb-24">
            <h2 className="t-display text-3xl md:text-5xl">How the Algorithm Works</h2>
            <p className="t-body max-w-3xl mx-auto text-base md:text-xl">Marketplaces calculate shipping based on Volumetric Weight. If your product takes up the whole image, the algorithm assumes it's massive. We fix that.</p>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <motion.div variants={fadeUpVariant} className="bg-white p-8 md:p-10 rounded-3xl border border-[#e2e8f0] shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
                  <div className="absolute -top-6 -left-4 w-12 h-12 bg-[#0A0A14] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xl group-hover:scale-110 transition-transform">1</div>
                  <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center text-3xl mb-6"><i className="ti ti-scan"></i></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">Bounding Box Inference</h3>
                  <p className="text-[#475569] leading-relaxed text-base md:text-lg">If your product fills 90% of the frame, the algorithm assigns a higher volumetric weight slab. We analyze your catalog to find these hidden penalties.</p>
              </motion.div>
              <motion.div variants={fadeUpVariant} className="bg-white p-8 md:p-10 rounded-3xl border border-[#e2e8f0] shadow-lg hover:shadow-2xl transition-all duration-300 relative group mt-8 md:mt-0">
                  <div className="absolute -top-6 -left-4 w-12 h-12 bg-[#0A0A14] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xl group-hover:scale-110 transition-transform">2</div>
                  <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center text-3xl mb-6"><i className="ti ti-minimize"></i></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">AI Coverage Optimization</h3>
                  <p className="text-[#475569] leading-relaxed text-base md:text-lg">Our AI shrinks your product exactly to the 58-62% coverage sweet spot, filling the background seamlessly so it still looks premium to buyers.</p>
              </motion.div>
              <motion.div variants={fadeUpVariant} className="bg-white p-8 md:p-10 rounded-3xl border border-[#e2e8f0] shadow-lg hover:shadow-2xl transition-all duration-300 relative group mt-8 md:mt-0 md:translate-y-4">
                  <div className="absolute -top-6 -left-4 w-12 h-12 bg-[#0A0A14] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xl group-hover:scale-110 transition-transform">3</div>
                  <div className="w-16 h-16 bg-[#D1FAE5] text-[#10B981] rounded-2xl flex items-center justify-center text-3xl mb-6"><i className="ti ti-coin-rupee"></i></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">Immediate Slab Drop</h3>
                  <p className="text-[#475569] leading-relaxed text-base md:text-lg">By dropping from the 1kg slab to the 500g slab, you instantly save ₹20-40 per order. Pure profit margins, without touching the physical product.</p>
              </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. BEFORE & AFTER — ANIMATED */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-12 md:mb-16">
            <h2 className="t-display text-3xl md:text-5xl">See the Difference. In Real-Time.</h2>
            <p className="t-body max-w-3xl mx-auto text-base md:text-xl mt-4">Watch how CatalogIQ transforms your product image — reducing coverage from 90% to 58%, dropping volumetric weight, and cutting shipping costs instantly.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
            <BeforeAfterMotion />
          </motion.div>
        </div>
      </section>

      {/* 5. CALCULATOR SECTION */}
      <section id="calculator" className="py-20 md:py-32 bg-[#0A0A14] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#7C3AED] opacity-20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Calculate Your Actual Savings</h2>
            <p className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto">See exactly how much revenue you are losing to the algorithm every month.</p>
          </motion.div>
            
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-[2rem] p-6 md:p-12 shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-10">
                  <div className="bg-[#0A0A14] p-6 md:p-8 rounded-2xl border border-[#2a2a3e]">
                      <label className="block text-base md:text-lg font-semibold text-[#e2e8f0] mb-6 flex justify-between items-center">
                          <span>Avg. Product Weight (grams)</span>
                          <span className="text-[#A78BFA] bg-[#A78BFA]/10 px-4 py-2 rounded-lg font-mono">{calcWeight}g</span>
                      </label>
                      <input type="range" min="100" max="2000" step="50" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} className="w-full accent-[#7C3AED] h-2 bg-[#2a2a3e] rounded-lg appearance-none cursor-pointer" />
                      <div className="flex justify-between text-xs text-[#64748b] mt-3 font-semibold"><span>100g</span><span>2kg</span></div>
                  </div>
                  
                  <div className="bg-[#0A0A14] p-6 md:p-8 rounded-2xl border border-[#2a2a3e]">
                      <label className="block text-base md:text-lg font-semibold text-[#e2e8f0] mb-6 flex justify-between items-center">
                          <span>Monthly Order Volume</span>
                          <span className="text-[#A78BFA] bg-[#A78BFA]/10 px-4 py-2 rounded-lg font-mono">{calcItems} Orders</span>
                      </label>
                      <input type="range" min="10" max="5000" step="10" value={calcItems} onChange={(e) => setCalcItems(Number(e.target.value))} className="w-full accent-[#7C3AED] h-2 bg-[#2a2a3e] rounded-lg appearance-none cursor-pointer" />
                      <div className="flex justify-between text-xs text-[#64748b] mt-3 font-semibold"><span>10</span><span>5000+</span></div>
                  </div>
              </div>
              
              <div className="bg-gradient-to-b from-[#0A0A14] to-[#1a1a2e] rounded-[2rem] p-8 md:p-12 border-2 border-[#2a2a3e] flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-10 rounded-full blur-[50px]"></div>
                  
                  <div className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-widest">Estimated Monthly Savings</div>
                  <div className="text-6xl md:text-7xl font-black text-[#10B981] mb-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] tabular-nums">
                      ₹{totalMonthlySavings > 0 ? totalMonthlySavings.toLocaleString() : '0'}
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="text-sm md:text-base text-[#cbd5e1] bg-[#1a1a2e] p-4 rounded-xl border border-[#2a2a3e] flex justify-between items-center">
                        <span className="text-[#64748b]">Current Slab:</span>
                        <span className="font-bold text-white line-through opacity-60">₹{currentSlabCost}</span>
                    </div>
                    <div className="text-sm md:text-base text-[#10B981] bg-[#10B981]/10 p-4 rounded-xl border border-[#10B981]/30 flex justify-between items-center font-bold">
                        <span>New Slab Achieved:</span>
                        <span>₹{optimizedSlabCost}</span>
                    </div>
                  </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16 md:mb-24">
                <h2 className="t-display text-3xl md:text-5xl">Beyond Just Images.</h2>
                <p className="t-hero-sub text-base md:text-xl">A complete, powerful suite of tools to manage your entire catalog operations.</p>
            </motion.div>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div variants={fadeUpVariant} className="p-8 md:p-10 bg-[#f8fafc] rounded-3xl border border-[#e2e8f0] hover:border-[#7C3AED] hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#e2e8f0] mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <i className="ti ti-robot text-4xl text-[#A78BFA]"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0f172a] mb-4">AI Content Studio</h3>
                    <p className="text-[#475569] leading-relaxed text-lg">Generate SEO titles, descriptions, and bullet points automatically using ChatGPT-4o trained specifically on top-selling marketplace listings.</p>
                </motion.div>
                
                <motion.div variants={fadeUpVariant} className="p-8 md:p-10 bg-[#f8fafc] rounded-3xl border border-[#e2e8f0] hover:border-[#10B981] hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#e2e8f0] mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <i className="ti ti-file-spreadsheet text-4xl text-[#10B981]"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Bulk CSV Processor</h3>
                    <p className="text-[#475569] leading-relaxed text-lg">Upload 1,000 products at once. Our engine optimizes all images in the background and generates a ready-to-upload marketplace CSV file.</p>
                </motion.div>
                
                <motion.div variants={fadeUpVariant} className="p-8 md:p-10 bg-[#f8fafc] rounded-3xl border border-[#e2e8f0] hover:border-[#F59E0B] hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#e2e8f0] mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <i className="ti ti-search text-4xl text-[#F59E0B]"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Research Center</h3>
                    <p className="text-[#475569] leading-relaxed text-lg">Analyze competitors, find trending categories, and calculate perfect profit margins before committing to sourcing new inventory.</p>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-20 md:py-32 bg-[#f8fafc] border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16 md:mb-24">
              <h2 className="t-display text-3xl md:text-5xl">Trusted by 12,000+ Sellers</h2>
              <p className="text-[#475569] text-lg md:text-xl">Hear from e-commerce entrepreneurs who scaled their margins with CatalogIQ.</p>
            </motion.div>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <motion.div variants={fadeUpVariant} className="bg-white p-8 md:p-10 rounded-3xl shadow-md border border-[#e2e8f0] hover:shadow-xl transition-shadow">
                    <div className="flex gap-1 text-[#F59E0B] mb-6 text-xl"><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i></div>
                    <p className="text-[#0f172a] text-lg mb-8 italic leading-relaxed">"I was paying ₹110 shipping on my Saree catalog because of volumetric weight. CatalogIQ dropped the image size naturally, and now I pay ₹55. It literally saved my business."</p>
                    <div className="flex items-center gap-4 border-t border-[#f1f5f9] pt-6">
                        <div className="w-12 h-12 bg-[#7C3AED] text-white rounded-full flex items-center justify-center font-bold text-xl">R</div>
                        <div>
                            <div className="font-bold text-[#0f172a]">Rahul Patel</div>
                            <div className="text-sm text-[#64748b]">Surat Saree Manufacturer</div>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div variants={fadeUpVariant} className="bg-white p-8 md:p-10 rounded-3xl shadow-md border border-[#e2e8f0] hover:shadow-xl transition-shadow">
                    <div className="flex gap-1 text-[#F59E0B] mb-6 text-xl"><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i></div>
                    <p className="text-[#0f172a] text-lg mb-8 italic leading-relaxed">"The AI Background generator is flawless. It compresses the file size while making the image look like an expensive studio shoot. Pure magic for my clothing line."</p>
                    <div className="flex items-center gap-4 border-t border-[#f1f5f9] pt-6">
                        <div className="w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center font-bold text-xl">S</div>
                        <div>
                            <div className="font-bold text-[#0f172a]">Sneha M.</div>
                            <div className="text-sm text-[#64748b]">Meesho Top Seller</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUpVariant} className="bg-white p-8 md:p-10 rounded-3xl shadow-md border border-[#e2e8f0] hover:shadow-xl transition-shadow">
                    <div className="flex gap-1 text-[#F59E0B] mb-6 text-xl"><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i><i className="ti ti-star-filled"></i></div>
                    <p className="text-[#0f172a] text-lg mb-8 italic leading-relaxed">"We upload 500 products a day. The bulk CSV tool handles all the image optimization and generates titles automatically. Replaced two entire data entry employees."</p>
                    <div className="flex items-center gap-4 border-t border-[#f1f5f9] pt-6">
                        <div className="w-12 h-12 bg-[#0A0A14] text-white rounded-full flex items-center justify-center font-bold text-xl">A</div>
                        <div>
                            <div className="font-bold text-[#0f172a]">Amit Kumar</div>
                            <div className="text-sm text-[#64748b]">Electronics Importer</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 md:py-32 bg-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="t-display text-center mb-16 text-3xl md:text-5xl">Frequently Asked Questions</h2>
            <div className="space-y-6 md:space-y-8">
                <div className="bg-[#f8fafc] p-6 md:p-8 rounded-2xl border border-[#e2e8f0] hover:border-[#7C3AED] transition-colors">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-3 flex items-center gap-3"><i className="ti ti-help-circle text-[#7C3AED] text-2xl"></i> Is this legal on marketplaces?</h3>
                    <p className="text-[#475569] text-base md:text-lg leading-relaxed ml-9">Yes! We do not manipulate the physical product. We simply optimize the image padding, background coverage, and file size to comply strictly with marketplace guidelines while avoiding artificial algorithmic penalties.</p>
                </div>
                <div className="bg-[#f8fafc] p-6 md:p-8 rounded-2xl border border-[#e2e8f0] hover:border-[#7C3AED] transition-colors">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-3 flex items-center gap-3"><i className="ti ti-building-store text-[#7C3AED] text-2xl"></i> Which marketplaces do you support?</h3>
                    <p className="text-[#475569] text-base md:text-lg leading-relaxed ml-9">Our current algorithm targets Meesho's volumetric engine directly. We also fully support Flipkart and Amazon India requirements for 2026.</p>
                </div>
                <div className="bg-[#f8fafc] p-6 md:p-8 rounded-2xl border border-[#e2e8f0] hover:border-[#7C3AED] transition-colors">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-3 flex items-center gap-3"><i className="ti ti-cloud-download text-[#7C3AED] text-2xl"></i> Do I need to download software?</h3>
                    <p className="text-[#475569] text-base md:text-lg leading-relaxed ml-9">No, CatalogIQ is a 100% cloud-based SaaS platform. You can access the dashboard, run AI generation, and process bulk images directly from any browser on PC or Mobile.</p>
                </div>
            </div>
        </motion.div>
      </section>

      {/* 9. CTA */}
      <section className="py-24 md:py-40 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">Ready to double your margins?</h2>
            <p className="text-xl md:text-2xl text-[#EDE9FE] mb-12 max-w-2xl mx-auto font-medium leading-relaxed">Join 12,000+ sellers who are saving thousands of rupees on shipping every single day.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/signup" className="btn bg-white text-[#5B21B6] hover:bg-[#f8fafc] px-12 py-5 text-lg md:text-xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-300 rounded-2xl">Get Started Free</Link>
                <Link href="/pricing" className="btn border-2 border-[#A78BFA] text-white hover:bg-white/10 px-12 py-5 text-lg md:text-xl rounded-2xl transition-all duration-300">View Pricing Options</Link>
            </div>
            <p className="text-base text-[#A78BFA] mt-8 font-medium"><i className="ti ti-shield-check mr-1"></i> No credit card required for the Free plan.</p>
        </motion.div>
      </section>

    </div>
  );
}
